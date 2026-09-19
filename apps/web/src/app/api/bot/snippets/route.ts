import { NextRequest, NextResponse } from "next/server";
import { connectDB, Snippet, User, ISnippet } from "@codesnip/db";
import { FilterQuery } from "mongoose";
import { verifyBotRequest } from "@/lib/bot-auth";

export async function GET(req: NextRequest) {
    if (!verifyBotRequest(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const discordId = searchParams.get("discordId");
    const username = searchParams.get("username");

    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const rawLimit = parseInt(searchParams.get("limit") ?? "5", 10);
    const limit = Number.isNaN(rawLimit) ? 5 : Math.min(Math.max(rawLimit, 1), 10);

    const skip = (page - 1) * limit;

    if (!discordId && !username) {
        return NextResponse.json(
            { message: "discordId or username is required" },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        let targetUserId: string;
        let isSelf = false;

        if (username) {
            const targetUser = await User.findOne({ username }).select("_id discordId");
            if (!targetUser) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
            targetUserId = targetUser._id.toString();
            isSelf = !!discordId && targetUser.discordId === discordId;
        } else {
            const requester = await User.findOne({ discordId }).select("_id");
            if (!requester) {
                return NextResponse.json({ message: "Not linked" }, { status: 404 });
            }
            targetUserId = requester._id.toString();
            isSelf = true;
        }

        const filter: FilterQuery<ISnippet> = { author: targetUserId };
        if (!isSelf) {
            filter.isPublic = true;
        }

        const total = await Snippet.countDocuments(filter);

        const snippets = await Snippet.find(filter)
            .select("title desc language tags author createdAt updatedAt likesCount commentsCount isPublic")
            .populate("author", "name username image")
            .sort({ createdAt: -1 })
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
        console.error("Error fetching snippets for bot:", error);
        return NextResponse.json({ message: "Failed to fetch snippets" }, { status: 500 });
    }
}
