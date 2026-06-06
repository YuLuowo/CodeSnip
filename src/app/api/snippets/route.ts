import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Snippet, { ISnippet } from "@/models/Snippet";
import { FilterQuery } from "mongoose";
import { createEmbedding } from "@/lib/embedding";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const scope = searchParams.get("scope");
    const tag = searchParams.getAll("tag");
    const language = searchParams.getAll("language");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort");

    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        const userId = session?.user?.id;

        const filter: FilterQuery<ISnippet> = {};

        if (scope === "me") {
            filter.author = userId;
        } else {
            if (userId) {
                filter.$or = [
                    { isPublic: true },
                    { author: userId }
                ];
            } else {
                filter.isPublic = true;
            }
        }

        if (tag.length) {
            filter.tags = { $in: tag };
        }

        if (language.length) {
            filter.language = { $in: language };
        }

        if (search) {
            const queryEmbedding = await createEmbedding(search);

            const snippets = await Snippet.aggregate([
                {
                    $vectorSearch: {
                        index: "snippet_embedding_index",
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: 100,
                        limit: 50,
                        filter,
                    },
                },
                {
                    $project: {
                        title: 1,
                        language: 1,
                        tags: 1,
                        author: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        likes: 1,
                        isPublic: 1,
                        score: {
                            $meta: "vectorSearchScore",
                        },
                    },
                },
            ]);

            return NextResponse.json(snippets, { status: 200 });
        }

        const snippets = await Snippet.find(filter)
            .select("title language tags author createdAt updatedAt likes isPublic")
            .populate("author", "name image")
            .sort({ updatedAt: -1 });

        if (sort === "popular") {
            snippets.sort(
                (a, b) =>
                    b.likes.length - a.likes.length
            );
        } else if (sort === "latest") {
            snippets.sort(
                (a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        }

        return NextResponse.json(snippets, { status: 200 });
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return NextResponse.json({ message: "Failed to fetch snippets" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, language, code, tags, isPublic } = await req.json();

        const embeddingText = `
            Title: ${title}
            
            Language: ${language}
            
            Tags: ${tags.join(", ")}
            
            Code: ${code.slice(0, 1000)}`;

        const embedding: number[] = await createEmbedding(embeddingText);

        const newSnippet = await Snippet.create({
            title,
            language,
            code,
            tags,
            isPublic,
            author: session.user.id,
            embedding: embedding,
        });

        return NextResponse.json(newSnippet, { status: 201 });
    } catch (error) {
        console.error("Error creating snippet:", error);
        return NextResponse.json({ message: "Failed to create snippet" }, { status: 500 });
    }
}
