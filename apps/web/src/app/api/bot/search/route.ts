import { NextRequest, NextResponse } from "next/server";
import { connectDB, Snippet, ISnippet } from "@codesnip/db";
import { FilterQuery, PipelineStage } from "mongoose";
import { verifyBotRequest } from "@/lib/bot-auth";
import { createEmbedding } from "@/lib/embedding";

export async function GET(req: NextRequest) {
    if (!verifyBotRequest(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const language = searchParams.getAll("language");
    const tag = searchParams.getAll("tag");

    if (!q) {
        return NextResponse.json({ message: "q is required" }, { status: 400 });
    }

    const rawLimit = parseInt(searchParams.get("limit") ?? "5", 10);
    const limit = Number.isNaN(rawLimit) ? 5 : Math.min(Math.max(rawLimit, 1), 10);

    try {
        await connectDB();

        // Bot search is always public-only, even if the requester happens to
        // be the author of a matching private snippet — this keeps `/search`
        // a purely public exploration command, distinct from `/my-snippets`.
        const filter: FilterQuery<ISnippet> = { isPublic: true };

        if (tag.length) {
            filter.tags = { $in: tag };
        }

        if (language.length) {
            filter.language = { $in: language };
        }

        const total = await Snippet.countDocuments(filter);
        const queryEmbedding = await createEmbedding(q);

        const pipeline = [
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
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author",
            },
            {
                $project: {
                    title: 1,
                    desc: 1,
                    language: 1,
                    tags: 1,
                    author: {
                        name: "$author.name",
                        username: "$author.username",
                        image: "$author.image",
                    },
                    createdAt: 1,
                    updatedAt: 1,
                    likesCount: { $ifNull: ["$likesCount", 0] },
                    commentsCount: { $ifNull: ["$commentsCount", 0] },
                    isPublic: 1,
                    score: {
                        $meta: "vectorSearchScore",
                    },
                },
            },
            {
                $limit: limit,
            },
        ] as unknown as PipelineStage[];

        const snippets = await Snippet.aggregate(pipeline);

        return NextResponse.json({
            data: snippets,
            pagination: {
                total,
                page: 1,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error searching snippets for bot:", error);
        return NextResponse.json({ message: "Failed to search snippets" }, { status: 500 });
    }
}
