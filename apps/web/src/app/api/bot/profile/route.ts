import { NextRequest, NextResponse } from "next/server";
import { connectDB, User, UserProfile, Follow, Snippet } from "@codesnip/db";
import { verifyBotRequest } from "@/lib/bot-auth";

export async function GET(req: NextRequest) {
    if (!verifyBotRequest(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const discordId = searchParams.get("discordId");
    const username = searchParams.get("username");

    if (!discordId && !username) {
        return NextResponse.json(
            { message: "discordId or username is required" },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        const user = username
            ? await User.findOne({ username }).select("name username image createdAt")
            : await User.findOne({ discordId }).select("name username image createdAt");

        if (!user) {
            return NextResponse.json(
                { message: username ? "User not found" : "Not linked" },
                { status: 404 }
            );
        }

        const [profile, followersCount, followingCount, snippetsCount, topLanguages, topTags, featuredSnippet] =
            await Promise.all([
                UserProfile.findOne({ user: user._id }).select("bio website githubUrl"),
                Follow.countDocuments({ following: user._id }),
                Follow.countDocuments({ follower: user._id }),
                Snippet.countDocuments({ author: user._id, isPublic: true }),
                Snippet.aggregate([
                    { $match: { author: user._id, isPublic: true } },
                    { $group: { _id: "$language", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 3 },
                ]),
                Snippet.aggregate([
                    { $match: { author: user._id, isPublic: true } },
                    { $unwind: "$tags" },
                    { $group: { _id: "$tags", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 5 },
                ]),
                Snippet.findOne({ author: user._id, isPublic: true })
                    .sort({ likesCount: -1 })
                    .select("title likesCount"),
            ]);

        return NextResponse.json({
            user,
            profile: profile ?? { bio: "", website: "", githubUrl: "" },
            stats: {
                followersCount,
                followingCount,
                snippetsCount,
            },
            topLanguages: topLanguages.map((l) => ({
                language: l._id as string,
                count: l.count as number,
                percentage: snippetsCount > 0 ? Math.round((l.count / snippetsCount) * 100) : 0,
            })),
            topTags: topTags.map((t) => t._id as string),
            featuredSnippet:
                snippetsCount > 0 && featuredSnippet
                    ? {
                          _id: featuredSnippet._id.toString(),
                          title: featuredSnippet.title,
                          likesCount: featuredSnippet.likesCount ?? 0,
                      }
                    : null,
            joinedAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error fetching profile for bot:", error);
        return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
    }
}
