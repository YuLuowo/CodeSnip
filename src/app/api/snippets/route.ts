import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Snippet, { ISnippet } from "@/models/Snippet";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { createEmbedding } from "@/lib/embedding";
import { tagMap } from "@/lib/utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const scope = searchParams.get("scope");
    const tag = searchParams.getAll("tag");
    const language = searchParams.getAll("language");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort");

    const rawPage = parseInt(
        searchParams.get("page") ?? "1",
        10
    );

    const page =
        Number.isNaN(rawPage) || rawPage < 1
            ? 1
            : rawPage;

    const rawLimit = parseInt(
        searchParams.get("limit") ?? "10",
        10
    );

    const limit =
        Number.isNaN(rawLimit)
            ? 10
            : Math.min(
                Math.max(rawLimit, 1),
                10
            );

    const skip = (page - 1) * limit;

    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        const userId = session?.user?.id;

        const filter: FilterQuery<ISnippet> = {};

        if (scope === "me") {
            filter.author = userId;
        } else if (scope) {
            if (userId) {
                filter.author = userId;
            } else {
                filter.author = new mongoose.Types.ObjectId(scope);
                filter.isPublic = true;
            }
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
            filter.tags = {
                $in: tag.map(t => tagMap[t] ?? t)
            };
        }

        if (language.length) {
            filter.language = { $in: language };
        }

        const total = await Snippet.countDocuments(filter);

        if (search) {
            const queryEmbedding = await createEmbedding(search);

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
                        language: 1,
                        tags: 1,
                        author: {
                            name: "$author.name",
                            image: "$author.image",
                        },
                        createdAt: 1,
                        updatedAt: 1,
                        likes: 1,
                        likesCount: 1,
                        isPublic: 1,
                        score: {
                            $meta: "vectorSearchScore",
                        },
                    },
                },
            ] as unknown as PipelineStage[];

            if (sort === "popular") {
                pipeline.push({
                    $sort: {
                        likesCount: -1,
                    },
                });
            }

            pipeline.push(
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                }
            );

            const snippets = await Snippet.aggregate(pipeline);

            return NextResponse.json({
                data: snippets,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }

        const snippets = await Snippet.find(filter)
            .select("title language tags author createdAt updatedAt likes likesCount isPublic")
            .populate("author", "name image")
            .sort(
                sort === "popular"
                    ? { likesCount: -1 }
                    : { updatedAt: -1 }
            )
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            data: snippets,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
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

        const { title, language, code, tags, isPublic, isAiDoc, aiDocType } = await req.json();

        const embeddingText = isAiDoc
            ? `
                Title: ${title}
                Type: ${aiDocType}
                Tags: ${tags.join(", ")}
                Content: ${code.slice(0, 1500)}`
            : `
                Title: ${title}
                Language: ${language}
                Tags: ${tags.join(", ")}
                Code: ${code.slice(0, 1000)}`;

        const embedding: number[] = await createEmbedding(embeddingText);

        const newSnippet = await Snippet.create({
            title,
            language: language.toLowerCase(),
            code,
            tags: tags.map((tag: string) => tagMap[tag] ?? tag),
            isPublic,
            author: session.user.id,
            embedding: embedding,
            isAiDoc,
            aiDocType
        });

        return NextResponse.json(newSnippet, { status: 201 });
    } catch (error) {
        console.error("Error creating snippet:", error);
        return NextResponse.json({ message: "Failed to create snippet" }, { status: 500 });
    }
}
