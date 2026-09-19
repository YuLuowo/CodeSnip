import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, User } from "@codesnip/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const settingsUrl = new URL("/settings", process.env.NEXTAUTH_URL);
    settingsUrl.searchParams.set("tab", "connections");

    if (!session) {
        settingsUrl.searchParams.set("discord", "error");
        return NextResponse.redirect(settingsUrl);
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = req.cookies.get("discord_oauth_state")?.value;

    if (!code || !state || !storedState || state !== storedState) {
        settingsUrl.searchParams.set("discord", "error");
        return NextResponse.redirect(settingsUrl);
    }

    try {
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/discord/callback`;

        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID!,
                client_secret: process.env.DISCORD_CLIENT_SECRET!,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            settingsUrl.searchParams.set("discord", "error");
            return NextResponse.redirect(settingsUrl);
        }

        const tokenData = await tokenRes.json();

        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!userRes.ok) {
            settingsUrl.searchParams.set("discord", "error");
            return NextResponse.redirect(settingsUrl);
        }

        const discordUser = await userRes.json();

        await connectDB();

        const existing = await User.findOne({ discordId: discordUser.id });
        if (existing && existing._id.toString() !== session.user.id) {
            settingsUrl.searchParams.set("discord", "already_linked");
            const response = NextResponse.redirect(settingsUrl);
            response.cookies.delete("discord_oauth_state");
            return response;
        }

        const avatar = discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null;

        await User.findByIdAndUpdate(session.user.id, {
            discordId: discordUser.id,
            discordUsername: discordUser.username,
            discordAvatar: avatar,
            discordLinkedAt: new Date(),
        });

        settingsUrl.searchParams.set("discord", "success");
        const response = NextResponse.redirect(settingsUrl);
        response.cookies.delete("discord_oauth_state");
        return response;
    } catch (err) {
        console.error(err);
        settingsUrl.searchParams.set("discord", "error");
        return NextResponse.redirect(settingsUrl);
    }
}
