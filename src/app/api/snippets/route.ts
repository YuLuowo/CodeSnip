import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Snippet, { ISnippet } from "@/models/Snippet";
import { FilterQuery } from "mongoose";

interface Filters {
    author: string | undefined;
    isPublic: boolean;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const scope = searchParams.get("scope");
    const tag = searchParams.get("tag");
    const language = searchParams.get("language");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        const userId = session?.user?.id;

        const filter: FilterQuery<ISnippet> = {};

        if (scope === "me") {
            filter.author = userId;
        } else {
            filter.isPublic = true;
        }

        const snippets = await Snippet.find(filter)
            .select("title language tags author createdAt likes")
            .populate("author", "name image")
            .sort({ createdAt: -1 });

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

        const newSnippet = await Snippet.create({
            title,
            language,
            code,
            tags,
            isPublic,
            author: session.user.id,
        });

        return NextResponse.json(newSnippet, { status: 201 });
    } catch (error) {
        console.error("Error creating snippet:", error);
        return NextResponse.json({ message: "Failed to create snippet" }, { status: 500 });
    }
}
