import { NextResponse, NextRequest } from "next/server";
import { connectDB, Snippet, User } from "@codesnip/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { userId } = await req.json();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const snippet = await Snippet.findById(id);
        if (!snippet) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const alreadyLiked = snippet.likes.some(
            (likeId) => likeId.toString() === userId
        );

        if (alreadyLiked) {
            snippet.likes = snippet.likes.filter((likeId) => likeId.toString() !== userId);
            snippet.likesCount = snippet.likes.length;
            user.likedSnippets = user.likedSnippets.filter((snippetId) => snippetId.toString() !== id);
        } else {
            snippet.likes.push(userId);
            snippet.likesCount = snippet.likes.length;
            user.likedSnippets.push(snippet._id as mongoose.Types.ObjectId);
        }

        await snippet.save();
        await user.save();

        return NextResponse.json({ success: true, likes: snippet.likes });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}