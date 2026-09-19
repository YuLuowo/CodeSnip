import { NextRequest, NextResponse } from "next/server";
import { connectDB, Snippet, User } from "@codesnip/db";
import { Types } from "mongoose";
import { verifyBotRequest } from "@/lib/bot-auth";

interface RouteParams {
    params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    if (!verifyBotRequest(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid snippet id" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const discordId = searchParams.get("discordId");

    try {
        await connectDB();

        const snippet = await Snippet.findById(id)
            .select("-embedding")
            .populate("author", "name username image discordId");

        if (!snippet) {
            return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
        }

        if (!snippet.isPublic) {
            const requester = discordId
                ? await User.findOne({ discordId }).select("_id")
                : null;

            const isAuthor =
                requester &&
                snippet.author._id.toString() === requester._id.toString();

            if (!isAuthor) {
                return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
            }
        }

        return NextResponse.json(snippet);
    } catch (error) {
        console.error("Error fetching snippet for bot:", error);
        return NextResponse.json({ message: "Failed to fetch snippet" }, { status: 500 });
    }
}
