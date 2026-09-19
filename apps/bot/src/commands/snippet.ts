import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../lib/discord-client.js";
import { getSnippetById } from "../lib/api-client.js";
import { buildSnippetDetailEmbed, buildErrorEmbed } from "../utils/embed.js";

const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("snippet")
        .setDescription("View the content of a snippet by its id")
        .addStringOption((option) =>
            option.setName("id").setDescription("The snippet's id").setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getString("id", true);
        const discordId = interaction.user.id;

        const snippet = await getSnippetById(id, discordId);

        if (!snippet) {
            await interaction.editReply({
                embeds: [
                    buildErrorEmbed(
                        "Snippet not found",
                        "This snippet doesn't exist, or it's private and you don't have permission to view it."
                    ),
                ],
            });
            return;
        }

        await interaction.editReply({
            embeds: [buildSnippetDetailEmbed(snippet)],
        });
    },
};

export default command;
