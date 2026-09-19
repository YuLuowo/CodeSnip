import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@codesnip/db";
import { verifyBotRequest } from "@/lib/bot-auth";

interface RouteParams {
    params: { discordId: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    if (!verifyBotRequest(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { discordId } = await params;

    try {
        await connectDB();

        const user = await User.findOne({ discordId }).select(
            "name username image discordId discordUsername"
        );

        if (!user) {
            return NextResponse.json({ message: "Not linked" }, { status: 404 });
        }

        return NextResponse.json({
            userId: user._id,
            name: user.name,
            username: user.username,
            image: user.image,
            discordId: user.discordId,
            discordUsername: user.discordUsername,
        });
    } catch (error) {
        console.error("Error fetching user by discordId:", error);
        return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
    }
}
