export function verifyBotRequest(req: Request): boolean {
    const auth = req.headers.get("authorization");
    const secret = process.env.BOT_API_SECRET;

    if (!secret) return false;

    return auth === `Bearer ${secret}`;
}
