import 'dotenv/config';

type EmbeddingCacheEntry = {
    value: number[];
    expiresAt: number;
};

const EMBEDDING_CACHE_TTL_MS = 10 * 60 * 1000;
const EMBEDDING_CACHE_MAX_SIZE = 200;

const embeddingCache = new Map<string, EmbeddingCacheEntry>();

function getCacheKey(text: string) {
    return text.trim().toLowerCase();
}

function getFromCache(key: string): number[] | undefined {
    const entry = embeddingCache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
        embeddingCache.delete(key);
        return undefined;
    }

    embeddingCache.delete(key);
    embeddingCache.set(key, entry);
    return entry.value;
}

function setToCache(key: string, value: number[]) {
    if (embeddingCache.size >= EMBEDDING_CACHE_MAX_SIZE) {
        const oldestKey = embeddingCache.keys().next().value;
        if (oldestKey !== undefined) {
            embeddingCache.delete(oldestKey);
        }
    }

    embeddingCache.set(key, {
        value,
        expiresAt: Date.now() + EMBEDDING_CACHE_TTL_MS,
    });
}

export async function createEmbedding(text: string) {
    const cacheKey = getCacheKey(text);
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }

    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: text,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate embedding");
    }

    const result = await response.json();
    setToCache(cacheKey, result);

    return result;
}