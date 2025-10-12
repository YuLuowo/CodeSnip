import { NextResponse } from "next/server";
import Snippet from "@/models/Snippet";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { id } = await context.params;
        const snippet = await Snippet.findById(id).populate("author", "name email");
        if (!snippet?.isPublic && snippet?.author.toString() !== session?.user?.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (!snippet) return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
        return NextResponse.json(snippet, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch snippet" }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { id } = await context.params;
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const snippet = await Snippet.findById(id);
        if (!snippet) return NextResponse.json({ message: "Snippet not found" }, { status: 404 });

        if (snippet.author.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const updated = await Snippet.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update snippet" }, { status: 500 });
    }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { id } = await context.params;
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const snippet = await Snippet.findById(id);
        if (!snippet) return NextResponse.json({ message: "Snippet not found" }, { status: 404 });

        if (snippet.author.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Snippet.findByIdAndDelete(id);
        return NextResponse.json({ message: "Snippet deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete snippet" }, { status: 500 });
    }
}
