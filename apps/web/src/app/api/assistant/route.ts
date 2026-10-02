import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, Snippet, ISnippet } from "@codesnip/db";
import { FilterQuery, PipelineStage } from "mongoose";
import { createEmbedding } from "@/lib/embedding";
import { generateAssistantReply } from "@/lib/gemini";

const MAX_CODE_LENGTH = 900;
const SEARCH_LIMIT = 5;
const SEARCH_NUM_CANDIDATES = 150;

type SupportedLocale = "en" | "zh-TW";

function normalizeLocale(locale: unknown): SupportedLocale {
    return locale === "en" ? "en" : "zh-TW";
}

function buildPrompt(query: string, snippets: {
    title: string;
    desc: string;
    language: string;
    aiDocType: string;
    code: string;
}[], locale: SupportedLocale) {
    const snippetsText = snippets
        .map((s, i) => `
片段 ${i + 1}：
- 標題：${s.title}
- 描述：${s.desc || "（無描述）"}
- 語言：${s.language}
- 類型：${s.aiDocType}
- 程式碼內容：
\`\`\`${s.language}
${s.code.slice(0, MAX_CODE_LENGTH)}
\`\`\`
`)
        .join("\n");

    const languageInstruction = locale === "en"
        ? "Reply in English, with a natural, professional, and concise tone."
        : "用繁體中文回覆，語氣自然、專業、簡潔。";

    const introInstruction = locale === "en"
        ? "a short 1-2 sentence opening message that tells the user these candidate snippets were found for their query, without repeating the per-snippet reasons"
        : "一段簡短（1~2 句）的開場白，告訴使用者已經找到這些候選片段，不要重複每個片段的詳細理由";

    const reasonInstruction = locale === "en"
        ? "why this snippet is recommended (relevance to the query) and how it could be used (use cases, caveats, or extension ideas). Do not mention vector search / embedding / similarity score. If the snippet is not very relevant, say so honestly instead of forcing a connection. Do not repeat the full code, just give a precise explanation."
        : "簡短說明「為什麼推薦它」（它跟使用者查詢的關聯性），以及「可以怎麼使用它」（使用情境、注意事項或延伸建議）。不要提到「向量搜尋」、「embedding」、「相似度分數」等技術實作細節。如果候選片段內容跟查詢關聯性不高，也請誠實反映，不要硬套關聯。不需要重複貼出完整程式碼，只需要根據程式碼內容做出精準的說明。";

    const suggestionsInstruction = locale === "en"
        ? "a list of 2 to 3 short follow-up search keywords (in English) that the user might want to search next, based on this query and the candidate snippets"
        : "2 到 3 個簡短的「使用者可能接下來想搜尋」的延伸關鍵字（繁體中文），根據這次查詢與候選片段推測";

    return `你是 CodeSnip 網站中的「AI Resource Assistant」，專門協助使用者從網站的 AI 相關程式碼片段中，找到最符合需求的資源。

使用者的查詢是：「${query}」

系統已經透過語意相似度搜尋，找到以下 ${snippets.length} 個最相關的候選片段：
${snippetsText}

請你完成以下任務，並「只」回傳一個 JSON 物件（不要加上 markdown 的 \`\`\`json 區塊，不要有任何其他文字），格式為：
{
  "message": "string，${languageInstruction}${introInstruction}",
  "reasons": [
    { "title": "片段的標題（必須跟候選片段的標題完全一致）", "reason": "string，${languageInstruction}${reasonInstruction}" }
  ],
  "suggestions": [${suggestionsInstruction}]
}
"reasons" 陣列必須包含全部 ${snippets.length} 個片段，且順序與候選片段相同。`;
}

type SnippetReason = { title: string; reason: string };

type StreamEvent =
    | { stage: "embedding" }
    | { stage: "searching" }
    | { stage: "generating" }
    | { stage: "done"; message: string; reasons: SnippetReason[]; suggestions: string[]; data: unknown[] }
    | { stage: "error"; message: string };

function sseEncode(event: StreamEvent) {
    return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
    let body: { query?: unknown; locale?: unknown };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ message: "Invalid request body" }), { status: 400 });
    }

    const { query, locale } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
        return new Response(JSON.stringify({ message: "Query is required" }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const normalizedLocale = normalizeLocale(locale);

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: StreamEvent) => {
                controller.enqueue(new TextEncoder().encode(sseEncode(event)));
            };

            try {
                await connectDB();

                const filter: FilterQuery<ISnippet> = {
                    isAiDoc: true,
                    aiDocType: "ai-context",
                    $or: [{ isPublic: true }, { author: userId }],
                };

                send({ stage: "embedding" });
                const queryEmbedding = await createEmbedding(query);

                send({ stage: "searching" });
                const pipeline = [
                    {
                        $vectorSearch: {
                            index: "snippet_embedding_index",
                            path: "embedding",
                            queryVector: queryEmbedding,
                            numCandidates: SEARCH_NUM_CANDIDATES,
                            limit: SEARCH_LIMIT,
                            filter,
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "author",
                            foreignField: "_id",
                            as: "author",
                        },
                    },
                    { $unwind: "$author" },
                    {
                        $project: {
                            title: 1,
                            desc: 1,
                            language: 1,
                            tags: 1,
                            code: 1,
                            aiDocType: 1,
                            author: {
                                name: "$author.name",
                                image: "$author.image",
                            },
                            createdAt: 1,
                            updatedAt: 1,
                            likes: 1,
                            likesCount: 1,
                            isPublic: 1,
                        },
                    },
                ] as unknown as PipelineStage[];

                const snippets = await Snippet.aggregate(pipeline);

                if (!snippets.length) {
                    send({ stage: "done", message: "", reasons: [], suggestions: [], data: [] });
                    controller.close();
                    return;
                }

                send({ stage: "generating" });

                let aiMessage = "";
                let reasons: SnippetReason[] = [];
                let suggestions: string[] = [];
                try {
                    const raw = await generateAssistantReply(
                        buildPrompt(query, snippets.map((s) => ({
                            title: s.title,
                            desc: s.desc,
                            language: s.language,
                            aiDocType: s.aiDocType,
                            code: s.code,
                        })), normalizedLocale),
                        { json: true }
                    );

                    try {
                        const parsed = JSON.parse(raw);
                        aiMessage = typeof parsed.message === "string" ? parsed.message : "";
                        reasons = Array.isArray(parsed.reasons)
                            ? parsed.reasons.filter((r: unknown): r is SnippetReason =>
                                !!r && typeof r === "object" && typeof (r as SnippetReason).title === "string" && typeof (r as SnippetReason).reason === "string")
                            : [];
                        suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.filter((s: unknown) => typeof s === "string") : [];
                    } catch {
                        aiMessage = raw;
                    }
                } catch (error) {
                    console.error("Error generating Gemini reply:", error);
                }

                send({ stage: "done", message: aiMessage, reasons, suggestions, data: snippets });
                controller.close();
            } catch (error) {
                console.error("Error in assistant route:", error);
                send({ stage: "error", message: "Failed to process assistant request" });
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
