import { NextResponse, NextRequest } from "next/server";
import { connectDB, Comment, Snippet } from "@codesnip/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest, context: { params: Promise<{ commentId: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { commentId } = await context.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        const snippet = await Snippet.findById(comment.snippet);
        if (!snippet) {
            return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
        }

        const isCommentAuthor = comment.author.toString() === session.user.id;
        const isSnippetAuthor = snippet.author.toString() === session.user.id;

        if (!isCommentAuthor && !isSnippetAuthor) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const repliesResult = await Comment.deleteMany({ parentComment: commentId });
        await Comment.findByIdAndDelete(commentId);

        const removedCount = 1 + repliesResult.deletedCount;
        snippet.commentsCount = Math.max(0, (snippet.commentsCount || 0) - removedCount);
        await snippet.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
