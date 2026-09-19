import type { BotClient } from "../lib/discord-client.js";

export function registerReadyEvent(client: BotClient): void {
    client.once("ready", (readyClient) => {
        console.log(`Bot logged in as ${readyClient.user.tag}`);
    });
}
