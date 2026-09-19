import { EmbedBuilder } from "discord.js";
import type { BotSnippet } from "../lib/api-client.js";

const BRAND_COLOR = 0x3b82f6; // Tailwind blue-500, matches the site's primary color
const ERROR_COLOR = 0xef4444; // Tailwind red-500

const SITE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

export function buildErrorEmbed(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder().setColor(ERROR_COLOR).setTitle(title).setDescription(description);
}

export function buildSnippetListEmbed(snippets: BotSnippet[], total: number): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("My Snippets")
        .setDescription(`${total} snippet(s) total, showing the latest ${snippets.length}`);

    for (const snippet of snippets) {
        embed.addFields({
            name: snippet.title || "(untitled)",
            value: [
                `Language: ${snippet.language}`,
                `Likes: ${snippet.likesCount} \u2022 Comments: ${snippet.commentsCount}`,
                `[View snippet](${SITE_URL}/snippets/${snippet._id})`,
            ].join("\n"),
        });
    }

    return embed;
}

export function buildSnippetDetailEmbed(snippet: BotSnippet): EmbedBuilder {
    const codePreview = snippet.code
        ? snippet.code.length > 1000
            ? `${snippet.code.slice(0, 1000)}\n... (content truncated, view the full snippet on the website)`
            : snippet.code
        : "(no code content)";

    const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle(snippet.title || "(untitled)")
        .setDescription(snippet.desc || "No description provided")
        .addFields(
            { name: "Author", value: snippet.author?.name ?? "Unknown", inline: true },
            { name: "Language", value: snippet.language, inline: true },
            {
                name: "Status",
                value: snippet.isPublic ? "Public" : "Private",
                inline: true,
            },
            {
                name: "Likes / Comments",
                value: `${snippet.likesCount} / ${snippet.commentsCount}`,
                inline: true,
            },
            {
                name: "Code",
                value: `\`\`\`${snippet.language}\n${codePreview}\n\`\`\``,
            }
        )
        .setURL(`${SITE_URL}/snippets/${snippet._id}`)
        .setFooter({ text: "CodeSnip" });

    if (snippet.tags?.length) {
        embed.addFields({ name: "Tags", value: snippet.tags.join(", ") });
    }

    return embed;
}
