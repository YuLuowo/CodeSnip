import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../lib/discord-client.js";
import { getUserByDiscordId, getProfile } from "../lib/api-client.js";
import { buildProfileEmbed, buildErrorEmbed } from "../utils/embed.js";

const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("View your CodeSnip profile or someone else's")
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("The username to look up (leave empty to view your own profile)")
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction) {
        const username = interaction.options.getString("username");

        if (!username) {
            await interaction.deferReply({ ephemeral: true });

            const discordId = interaction.user.id;
            const linkedUser = await getUserByDiscordId(discordId);

            if (!linkedUser) {
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

            const profile = await getProfile({ discordId });

            if (!profile) {
                await interaction.editReply({
                    embeds: [
                        buildErrorEmbed("Profile not found", "Could not load your profile."),
                    ],
                });
                return;
            }

            await interaction.editReply({ embeds: [buildProfileEmbed(profile)] });
            return;
        }

        await interaction.deferReply();

        const profile = await getProfile({ username });

        if (!profile) {
            await interaction.editReply({
                embeds: [
                    buildErrorEmbed(
                        "User not found",
                        `No CodeSnip user found with username "${username}".`
                    ),
                ],
            });
            return;
        }

        await interaction.editReply({ embeds: [buildProfileEmbed(profile)] });
    },
};

export default command;
