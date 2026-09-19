import type { BotClient } from "../lib/discord-client.js";
import { buildErrorEmbed } from "../utils/embed.js";

export function registerInteractionCreateEvent(client: BotClient): void {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);

            const errorEmbed = buildErrorEmbed(
                "Something went wrong",
                "An error occurred while executing this command. Please try again later."
            );

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    });
}
