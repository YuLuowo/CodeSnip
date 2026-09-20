import { env } from "./env.js";

interface BotUser {
    userId: string;
    name: string;
    username: string;
    image: string | null;
    discordId: string;
    discordUsername: string | null;
}

interface SnippetAuthor {
    _id: string;
    name: string;
    username: string;
    image: string | null;
}

export interface BotSnippet {
    _id: string;
    title: string;
    desc?: string;
    code?: string;
    language: string;
    tags: string[];
    author: SnippetAuthor;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
    isPublic: boolean;
}

interface SnippetListResponse {
    data: BotSnippet[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

async function botFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${env.API_BASE_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${env.BOT_API_SECRET}`,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string };

        throw new ApiError(
            res.status,
            body.message ?? `Request failed with ${res.status}`
        );
    }

    return res.json() as Promise<T>;
}

export async function getUserByDiscordId(discordId: string): Promise<BotUser | null> {
    try {
        return await botFetch<BotUser>(`/api/bot/users/by-discord/${discordId}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function getSnippetsByDiscordId(
    discordId: string,
    limit = 5
): Promise<SnippetListResponse> {
    return botFetch<SnippetListResponse>(
        `/api/bot/snippets?discordId=${encodeURIComponent(discordId)}&limit=${limit}`
    );
}

export async function getSnippetById(
    id: string,
    discordId?: string
): Promise<BotSnippet | null> {
    const query = discordId ? `?discordId=${encodeURIComponent(discordId)}` : "";
    try {
        return await botFetch<BotSnippet>(`/api/bot/snippets/${id}${query}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function searchPublicSnippets(
    query: string,
    limit = 5
): Promise<SnippetListResponse> {
    return botFetch<SnippetListResponse>(
        `/api/bot/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
}

export interface BotProfile {
    user: {
        name: string;
        username: string;
        image: string | null;
    };
    profile: {
        bio: string;
        website: string;
        githubUrl: string;
    };
    stats: {
        followersCount: number;
        followingCount: number;
        snippetsCount: number;
    };
    topLanguages: { language: string; count: number; percentage: number }[];
    topTags: string[];
    featuredSnippet: { _id: string; title: string; likesCount: number } | null;
    joinedAt: string;
}

export async function getProfile(params: {
    discordId?: string;
    username?: string;
}): Promise<BotProfile | null> {
    const query = params.username
        ? `username=${encodeURIComponent(params.username)}`
        : `discordId=${encodeURIComponent(params.discordId!)}`;

    try {
        return await botFetch<BotProfile>(`/api/bot/profile?${query}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export { ApiError };
