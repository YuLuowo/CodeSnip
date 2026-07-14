import 'dotenv/config';

export async function createEmbedding(text: string) {
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

    return await response.json();
}