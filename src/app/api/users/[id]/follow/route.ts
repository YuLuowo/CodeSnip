import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Follow from "@/models/Follow";
import mongoose from "mongoose";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        const currentUserId = session?.user?.id;
        const { id } = await context.params;

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
            followersCount,
            followingCount,
            isFollowing: Boolean(isFollowing),
        });
    } catch (err) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        const followerId = session.user.id;

        if (followerId === id) {
            return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const alreadyFollow = await Follow.findOne({
            follower: followerId,
            following: id,
        });

        if (alreadyFollow) {
            await Follow.deleteOne({
                _id: alreadyFollow._id
            })

            return NextResponse.json({
                success: true,
                following: false,
            });
        }

        await Follow.create({
            follower: new mongoose.Types.ObjectId(followerId),
            following: new mongoose.Types.ObjectId(id)
        });

        return NextResponse.json({
            success: true,
            following: true
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}