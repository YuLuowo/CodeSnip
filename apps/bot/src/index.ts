import { env } from "./lib/env.js";
import { client } from "./lib/discord-client.js";
import commands from "./commands/index.js";
import { registerReadyEvent } from "./events/ready.js";
import { registerInteractionCreateEvent } from "./events/interactionCreate.js";

for (const command of commands) {
    client.commands.set(command.data.name, command);
}

registerReadyEvent(client);
registerInteractionCreateEvent(client);

client.login(env.DISCORD_BOT_TOKEN).catch((error) => {
    console.error("Failed to login to Discord:", error);
    process.exit(1);
});
