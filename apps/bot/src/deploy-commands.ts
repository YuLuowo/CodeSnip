import { REST, Routes } from "discord.js";
import { env } from "./lib/env.js";
import commands from "./commands/index.js";

const body = commands.map((command) => command.data.toJSON());

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN);

async function deploy() {
    try {
        console.log(`Registering ${body.length} slash command(s)...`);

        await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: [] });
        await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), { body });

        console.log("Slash commands registered successfully.");
    } catch (error) {
        console.error("Failed to register slash commands:", error);
        process.exit(1);
    }
}

deploy();
