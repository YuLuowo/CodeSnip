import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const state = crypto.randomBytes(16).toString("hex");
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/discord/callback`;

    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "identify",
        state,
        prompt: "consent",
    });

    const response = NextResponse.redirect(
        `https://discord.com/api/oauth2/authorize?${params.toString()}`
    );

    response.cookies.set("discord_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10,
        path: "/",
    });

    return response;
}
