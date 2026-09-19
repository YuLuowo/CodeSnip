import { NextResponse } from "next/server";
import { connectDB, Follow } from "@codesnip/db";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get("limit")) || 3;

        const follows = await Follow.find({ follower: id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("following", "name username image");

        const following = follows.map((f) => f.following);

        return NextResponse.json({ following });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
