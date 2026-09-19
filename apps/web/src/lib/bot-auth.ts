import { NextRequest } from "next/server";

export function verifyBotRequest(req: NextRequest): boolean {
    const auth = req.headers.get("authorization");
    const secret = process.env.BOT_API_SECRET;

    if (!secret) return false;

    return auth === `Bearer ${secret}`;
}
