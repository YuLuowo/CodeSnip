import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../lib/discord-client.js";
import { searchPublicSnippets } from "../lib/api-client.js";
import { buildSnippetSearchEmbed, buildErrorEmbed } from "../utils/embed.js";

const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Search public snippets on CodeSnip")
        .addStringOption((option) =>
            option.setName("keyword").setDescription("Keyword to search for").setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction) {
        await interaction.deferReply();

        const keyword = interaction.options.getString("keyword", true);

        const { data, pagination } = await searchPublicSnippets(keyword, 5);

        if (data.length === 0) {
            await interaction.editReply({
                embeds: [
                    buildErrorEmbed(
                        "No results found",
                        `No public snippets matched "${keyword}". Try a different keyword.`
                    ),
                ],
            });
            return;
        }

        await interaction.editReply({
            embeds: [buildSnippetSearchEmbed(data, pagination.total, keyword)],
        });
    },
};

export default command;
