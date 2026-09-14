import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, Snippet, ISnippet } from "@codesnip/db";
import { FilterQuery, PipelineStage } from "mongoose";
import { createEmbedding } from "@/lib/embedding";
import { generateAssistantReply } from "@/lib/gemini";

const MAX_CODE_LENGTH = 1500;

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
        ? "1. Reply in English, with a natural, professional, and concise tone."
        : "1. 用繁體中文回覆，語氣自然、專業、簡潔。";

    return `你是 CodeSnip 網站中的「AI Resource Assistant」，專門協助使用者從網站的 AI 相關程式碼片段中，找到最符合需求的資源。

使用者的查詢是：「${query}」

系統已經透過語意相似度搜尋，找到以下 ${snippets.length} 個最相關的候選片段：
${snippetsText}

請你完成以下任務：
${languageInstruction}
2. 針對每一個片段，簡短說明「為什麼推薦它」（它跟使用者查詢的關聯性），以及「可以怎麼使用它」（使用情境、注意事項或延伸建議）。
3. 用清楚的條列式格式呈現，每個片段一段，並在開頭標註片段的標題。
4. 不要提到「向量搜尋」、「embedding」、「相似度分數」等技術實作細節。
5. 如果候選片段內容跟查詢關聯性不高，也請誠實反映，不要硬套關聯。
6. 不需要重複貼出完整程式碼，只需要根據程式碼內容做出精準的說明。`;
}

export async function POST(request: Request) {
    try {
        const { query, locale } = await request.json();

        if (!query || typeof query !== "string" || !query.trim()) {
            return NextResponse.json({ message: "Query is required" }, { status: 400 });
        }

        const normalizedLocale = normalizeLocale(locale);

        await connectDB();
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const filter: FilterQuery<ISnippet> = {
            isAiDoc: true,
            aiDocType: "ai-document",
        };

        if (userId) {
            filter.$or = [{ isPublic: true }, { author: userId }];
        } else {
            filter.isPublic = true;
        }

        const queryEmbedding = await createEmbedding(query);

        const pipeline = [
            {
                $vectorSearch: {
                    index: "snippet_embedding_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 3,
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
            return NextResponse.json({ message: "", data: [] });
        }

        let aiMessage = "";
        try {
            aiMessage = await generateAssistantReply(
                buildPrompt(query, snippets.map((s) => ({
                    title: s.title,
                    desc: s.desc,
                    language: s.language,
                    aiDocType: s.aiDocType,
                    code: s.code,
                })), normalizedLocale)
            );
        } catch (error) {
            console.error("Error generating Gemini reply:", error);
        }

        return NextResponse.json({
            message: aiMessage,
            data: snippets,
        });
    } catch (error) {
        console.error("Error in assistant route:", error);
        return NextResponse.json({ message: "Failed to process assistant request" }, { status: 500 });
    }
}
