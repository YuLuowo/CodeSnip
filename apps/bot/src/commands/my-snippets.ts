import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../lib/discord-client.js";
import { getUserByDiscordId, getSnippetsByDiscordId } from "../lib/api-client.js";
import { buildSnippetListEmbed, buildErrorEmbed } from "../utils/embed.js";

const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("my-snippets")
        .setDescription("View the snippets you've published on CodeSnip") as SlashCommandBuilder,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const discordId = interaction.user.id;
        const user = await getUserByDiscordId(discordId);

        if (!user) {
            await interaction.editReply({
                embeds: [
                    buildErrorEmbed(
                        "Account not linked",
                        "Please connect your Discord account on the CodeSnip website's /settings page before using this command."
                    ),
                ],
            });
            return;
        }

        const { data, pagination } = await getSnippetsByDiscordId(discordId, 5);

        if (data.length === 0) {
            await interaction.editReply({
                embeds: [buildErrorEmbed("No snippets yet", "You haven't published any snippets yet.")],
            });
            return;
        }

        await interaction.editReply({
            embeds: [buildSnippetListEmbed(data, pagination.total)],
        });
    },
};

export default command;
