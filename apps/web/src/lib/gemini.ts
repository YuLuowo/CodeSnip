import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient() {
    if (!client) {
        client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return client;
}

export async function generateAssistantReply(prompt: string, options?: { json?: boolean }) {
    const ai = getClient();

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        ...(options?.json ? { config: { responseMimeType: "application/json" } } : {}),
    });

    return response.text?.trim() ?? "";
}
