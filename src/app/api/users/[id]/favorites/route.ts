import { NextResponse } from "next/server";
import User from "@/models/User";
import "@/models/Snippet";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { id } = await context.params;

        const user = await User.findById(id).populate("likedSnippets");
        if (user?.id.toString() !== session?.user?.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ favorites: user.likedSnippets });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
