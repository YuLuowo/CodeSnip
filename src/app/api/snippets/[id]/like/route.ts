import { NextResponse, NextRequest } from "next/server";
import Snippet from "@/models/Snippet";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

        const alreadyLiked = snippet.likes.some(
            (likeId) => likeId.toString() === userId
        );

        if (alreadyLiked) {
            snippet.likes = snippet.likes.filter((likeId) => likeId.toString() !== userId);
        } else {
            snippet.likes.push(userId);
        }

        await snippet.save();

        return NextResponse.json({ success: true, likes: snippet.likes });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}