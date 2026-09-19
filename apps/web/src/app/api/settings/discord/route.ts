import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, User } from "@codesnip/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
        "discordId discordUsername discordAvatar discordLinkedAt"
    );

    if (!user || !user.discordId) {
        return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
        connected: true,
        discordId: user.discordId,
        discordUsername: user.discordUsername,
        discordAvatar: user.discordAvatar,
        discordLinkedAt: user.discordLinkedAt,
    });
}

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
        $unset: {
            discordId: "",
            discordUsername: "",
            discordAvatar: "",
            discordLinkedAt: "",
        },
    });

    return NextResponse.json({ success: true });
}
