import { NextResponse } from "next/server";
import "@/models/Snippet";
import { connectDB } from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Follow from "@/models/Follow";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user.id;

        const user = await User.findById(id)
            .select("name username image");
        const profile = await UserProfile.findOne({
            user: id,
        }).select("bio website githubUrl");

        const [followersCount, followingCount, isFollowing] =
            await Promise.all([
                Follow.countDocuments({
                    following: id,
                }),
                Follow.countDocuments({
                    follower: id,
                }),
                currentUserId
                    ? Follow.exists({
                        follower: currentUserId,
                        following: id,
                    })
                    : false,
            ]);

        return NextResponse.json({
            user,
            profile: profile ?? {
                bio: "",
                website: "",
                githubUrl: "",
            },
            followStats: {
                followersCount,
                followingCount,
                isFollowing: Boolean(isFollowing),
            }
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
