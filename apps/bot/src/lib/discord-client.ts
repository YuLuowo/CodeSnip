import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface BotCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class BotClient extends Client {
    commands = new Collection<string, BotCommand>();
}

export const client = new BotClient({
    intents: [GatewayIntentBits.Guilds],
});
