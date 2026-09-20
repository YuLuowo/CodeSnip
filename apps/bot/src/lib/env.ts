import "dotenv/config";

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    DISCORD_BOT_TOKEN: requireEnv("DISCORD_BOT_TOKEN"),
    DISCORD_CLIENT_ID: requireEnv("DISCORD_CLIENT_ID"),
    API_BASE_URL: process.env.API_BASE_URL ?? "http://localhost:3000",
    BOT_API_SECRET: requireEnv("BOT_API_SECRET"),
    DISCORD_GUILD_ID: requireEnv("DISCORD_GUILD_ID"),
};
