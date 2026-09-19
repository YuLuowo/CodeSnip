import { NextResponse, NextRequest } from "next/server";
import { connectDB, Comment, Snippet } from "@codesnip/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const total = await Comment.countDocuments({ snippet: id, parentComment: null });

        const comments = await Comment.find({ snippet: id, parentComment: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name username image")
            .lean();

        const commentIds = comments.map((c) => c._id);
        const replies = await Comment.find({ parentComment: { $in: commentIds } })
            .sort({ createdAt: 1 })
            .populate("author", "name username image")
            .lean();

        const commentsWithReplies = comments.map((comment) => ({
            ...comment,
            replies: replies.filter((r) => r.parentComment?.toString() === comment._id.toString()),
        }));

        return NextResponse.json({
            comments: commentsWithReplies,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const { content, parentComment } = await req.json();

        if (!content || !content.trim()) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 });
        }

        const snippet = await Snippet.findById(id);
        if (!snippet) {
            return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
        }

        const comment = await Comment.create({
            snippet: id,
            author: session.user.id,
            content: content.trim(),
            parentComment: parentComment || null,
        });

        snippet.commentsCount = (snippet.commentsCount || 0) + 1;
        await snippet.save();

        const populatedComment = await Comment.findById(comment._id).populate("author", "name username image");

        return NextResponse.json({ comment: populatedComment }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
