import { NextResponse } from "next/server";
import { connectDB, UserProfile, User, Follow } from "@codesnip/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { isUsernameAvailable } from "@/lib/username";

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

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        const t = await getTranslations("Settings.profile");

        if (!session || session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bio, website, githubUrl, username } = await req.json();

        if (username) {
            const currentUser = await User.findById(id).select("username");
            const isChanging = currentUser?.username !== username;

            if (isChanging) {
                const available = await isUsernameAvailable(username);
                if (!available) {
                    return NextResponse.json({ error: t("existing_user") }, { status: 409 });
                }
            }
        }

        const [user, profile] = await Promise.all([
            User.findByIdAndUpdate(
                id,
                { username },
                { new: true }
            ).select("name username image"),

            UserProfile.findOneAndUpdate(
                { user: id },
                { bio, website, githubUrl },
                { upsert: true, new: true }
            ).select("bio website githubUrl"),
        ]);

        return NextResponse.json({ user, profile });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}