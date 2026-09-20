import { EmbedBuilder } from "discord.js";
import type { BotSnippet, BotProfile } from "../lib/api-client.js";
import { getLanguageLabel, getTagLabel } from "./maps.js";

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
                `Language: ${getLanguageLabel(snippet.language)}`,
                `Likes: ${snippet.likesCount} \u2022 Comments: ${snippet.commentsCount}`,
                `[View snippet](${SITE_URL}/snippets/${snippet._id})`,
            ].join("\n"),
        });
    }

    return embed;
}

export function buildSnippetSearchEmbed(
    snippets: BotSnippet[],
    total: number,
    query: string
): EmbedBuilder {
    const searchUrl = `${SITE_URL}/search?q=${encodeURIComponent(query)}`;

    const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle(`Search results for "${query}"`)
        .setDescription(`Showing the top ${snippets.length} snippet(s)`)
        .setFooter({ text: "CodeSnip" });

    for (const snippet of snippets) {
        embed.addFields({
            name: snippet.title || "(untitled)",
            value: [
                `by ${snippet.author?.name ?? "Unknown"}`,
                `Language: ${getLanguageLabel(snippet.language)}`,
                `Likes: ${snippet.likesCount ?? 0} \u2022 Comments: ${snippet.commentsCount ?? 0}`,
                `[View snippet](${SITE_URL}/snippets/${snippet._id})`,
            ].join("\n"),
        });
    }

    embed.addFields({
        name: "\u200b",
        value: `[View all results on the website](${searchUrl})`,
    });

    return embed;
}

function toAbsoluteUrl(url: string): string {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function buildProgressBar(percentage: number, length = 10): string {
    const filled = Math.round((percentage / 100) * length);
    return `${"\u2588".repeat(filled)}${"\u2591".repeat(length - filled)}`;
}

function formatJoinedDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function buildProfileEmbed(profile: BotProfile): EmbedBuilder {
    const { user, profile: userProfile, stats, topLanguages, topTags, featuredSnippet, joinedAt } =
        profile;
    const profileUrl = `${SITE_URL}/users/${user.username}`;

    const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setAuthor({
            name: user.name ? `${user.name} (@${user.username})` : `@${user.username}`,
            iconURL: user.image ?? undefined,
            url: profileUrl,
        })
        .setURL(profileUrl)
        .setDescription(userProfile.bio || "No bio provided")
        .addFields(
            { name: "Snippets", value: `${stats.snippetsCount}`, inline: true },
            { name: "Followers", value: `${stats.followersCount}`, inline: true },
            { name: "Following", value: `${stats.followingCount}`, inline: true }
        );

    if (topLanguages.length) {
        embed.addFields({
            name: "Top Languages",
            value: topLanguages
                .map(
                    (l) =>
                        `${getLanguageLabel(l.language)}  ${buildProgressBar(l.percentage)}  ${l.percentage}% (${l.count})`
                )
                .join("\n"),
        });
    }

    if (topTags.length) {
        embed.addFields({
            name: "Top Tags",
            value: topTags.map((tag) => `#${getTagLabel(tag)}`).join("  "),
        });
    }

    if (featuredSnippet) {
        embed.addFields({
            name: "Featured Snippet",
            value: `[${featuredSnippet.title || "(untitled)"}](${SITE_URL}/snippets/${featuredSnippet._id})\n\u2665 ${featuredSnippet.likesCount} favorites`,
        });
    } else {
        embed.addFields({ name: "Featured Snippet", value: "No snippets yet" });
    }

    const links: string[] = [];
    if (userProfile.website) {
        links.push(`[Website](${toAbsoluteUrl(userProfile.website)})`);
    }
    if (userProfile.githubUrl) {
        links.push(`[GitHub](${toAbsoluteUrl(userProfile.githubUrl)})`);
    }
    if (links.length) {
        embed.addFields({ name: "Links", value: links.join("  |  ") });
    }

    const navLinks = [`[View Profile](${profileUrl})`];
    if (featuredSnippet) {
        navLinks.push(`[Featured Snippet](${SITE_URL}/snippets/${featuredSnippet._id})`);
    }
    embed.addFields({
        name: "\u200b",
        value: navLinks.join("  |  "),
    });

    embed.setFooter({ text: `CodeSnip \u2022 Joined ${formatJoinedDate(joinedAt)}` });

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
            { name: "Language", value: getLanguageLabel(snippet.language), inline: true },
            {
                name: "Status",
                value: snippet.isPublic ? "Public" : "Private",
                inline: true,
            },
            {
                name: "Likes / Comments",
                value: `${snippet.likesCount} / ${snippet.commentsCount}`,
            },
            {
                name: "Code",
                value: `\`\`\`${snippet.language}\n${codePreview}\n\`\`\``,
            }
        )
        .setURL(`${SITE_URL}/snippets/${snippet._id}`)
        .setFooter({ text: "CodeSnip" });

    if (snippet.tags?.length) {
        embed.addFields({ name: "Tags", value: snippet.tags.map(getTagLabel).join(", ") });
    }

    return embed;
}
