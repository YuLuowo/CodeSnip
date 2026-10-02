"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ISnippetClient } from "@/configs/types";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "use-intl";
import ThoughtLine from "@/components/ui/thought-line";
import * as React from "react";
import { SnippetReason } from "@/components/sections/assistant-preview-panel";
import { TypingAnimation } from "@/components/ui/typing-animation";

type Message = {
    sender: 'user' | 'ai';
    content: string;
};

type Stage = "embedding" | "searching" | "generating";

type DoneEvent = {
    stage: "done";
    message: string;
    suggestions?: string[];
    reasons?: SnippetReason[];
    data: ISnippetClient[];
};

type ErrorEvent = {
    stage: "error";
    message?: string;
};

type StageEvent = {
    stage: Stage;
};

type SSEEvent = DoneEvent | ErrorEvent | StageEvent;

interface AssistantChatProps {
    onResult: (snippets: ISnippetClient[], reasons: SnippetReason[]) => void;
}

export function AssistantChat({ onResult }: AssistantChatProps) {
    const t = useTranslations("AssistantPage.chat");
    const locale = useLocale();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', content: t("welcome") }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentStage, setCurrentStage] = useState<Stage | null>(null);
    const [completedStages, setCompletedStages] = useState<Stage[]>([]);
    const { data: session } = useSession();

    const STAGE_LABELS: Record<Stage, string> = {
        embedding: t("thinking.embedding"),
        searching: t("thinking.searching"),
        generating: t("thinking.generating"),
    };

    const DEFAULT_QUICK_KEYWORDS = [
        t("quick_keywords.improve_ui"),
        t("quick_keywords.agent"),
        t("quick_keywords.mcp"),
    ];
    const [quickKeywords, setQuickKeywords] = useState<string[]>(DEFAULT_QUICK_KEYWORDS);
    const [hasDynamicKeywords, setHasDynamicKeywords] = useState(false);

    const handleSend = async (overrideQuery?: string) => {
        const query = (overrideQuery ?? input).trim();
        if (!query) return;

        const userMessage: Message = { sender: 'user', content: query };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setCompletedStages([]);
        setCurrentStage("embedding");

        try {
            const res = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, locale }),
            });

            if (res.status === 401) {
                setMessages((prev) => [...prev, { sender: 'ai', content: t("login_required") }]);
                return;
            }
            if (!res.ok || !res.body) throw new Error("Failed to search");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let doneEvent: DoneEvent | null = null;
            let serverError: string | null = null;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                const parts = buffer.split("\n\n");
                buffer = parts.pop() ?? "";
                for (const part of parts) {
                    const line = part.trim();
                    if (!line.startsWith("data:")) continue;
                    const json = line.slice(5).trim();
                    let event: SSEEvent | null = null;
                    try {
                        event = JSON.parse(json) as SSEEvent;
                    } catch {
                        continue; // ignore malformed chunk
                    }
                    if (!event) continue;
                    if (event.stage === "done") {
                        doneEvent = event;
                    } else if (event.stage === "error") {
                        serverError = event.message || "Failed to search";
                    } else if (event.stage === "embedding" || event.stage === "searching" || event.stage === "generating") {
                        const stage = event.stage;
                        setCurrentStage((prevStage) => {
                            if (prevStage) setCompletedStages((prev) => [...prev, prevStage]);
                            return stage;
                        });
                    }
                }
            }

            if (serverError) throw new Error(serverError);

            const snippets: ISnippetClient[] = doneEvent?.data ?? [];
            const reasons: SnippetReason[] = doneEvent?.reasons ?? [];
            const suggestions: string[] = doneEvent?.suggestions ?? [];
            const aiResponse: Message = {
                sender: 'ai',
                content: snippets.length > 0
                    ? (doneEvent?.message?.trim() || t("found_results", { count: snippets.length }))
                    : t("no_results"),
            };
            setMessages((prev) => [...prev, aiResponse]);
            if (suggestions.length > 0) {
                setQuickKeywords(suggestions.slice(0, 3));
                setHasDynamicKeywords(true);
            }
            onResult(snippets, reasons);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, { sender: 'ai', content: t("error") }]);
        } finally {
            setLoading(false);
            setCurrentStage(null);
            setCompletedStages([]);
        }
    };

    const handleQuickKeywordClick = (keyword: string) => {
        if (loading) return;
        handleSend(keyword);
    };

    const handleResetQuickKeywords = () => {
        setQuickKeywords(DEFAULT_QUICK_KEYWORDS);
        setHasDynamicKeywords(false);
    };

    return (
        <div className="flex h-full flex-col gap-4 border rounded-sm p-3 sm:p-4">
            <div className="font-semibold">{t("title")}</div>

            <div className="flex flex-1 flex-col gap-4 min-h-0">
                <div className="flex-1 overflow-y-auto space-y-2">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-3 py-2 rounded-sm max-w-[85%] sm:max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground whitespace-pre-wrap' : 'bg-muted'}`}>
                                {msg.sender === 'ai' ?
                                    <TypingAnimation
                                        typeSpeed={30}
                                        pauseDelay={1200}
                                        showCursor
                                        blinkCursor
                                        cursorStyle="line"
                                        className="text-sm text-foreground"
                                    >
                                        {msg.content}
                                    </TypingAnimation>
                                    : msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start gap-2 sm:gap-3">
                            <div className="px-6 py-2 rounded-sm bg-muted">
                                <ThoughtLine
                                    label={currentStage ? STAGE_LABELS[currentStage] : t("thinking.default")}
                                    steps={completedStages.map((s) => STAGE_LABELS[s])}
                                    working
                                    collapsible={false}
                                    showTimer={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 pt-4 border-t">
                    <div className="flex flex-wrap items-center gap-2">
                        {quickKeywords.map((keyword, idx) => (
                            <Badge
                                key={`${idx}-${keyword}`}
                                variant="secondary"
                                onClick={() => handleQuickKeywordClick(keyword)}
                                className={`cursor-pointer select-none hover:bg-secondary/70 ${loading ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                {keyword}
                            </Badge>
                        ))}
                        {hasDynamicKeywords && (
                            <Badge
                                variant="outline"
                                onClick={handleResetQuickKeywords}
                                className={`cursor-pointer select-none hover:bg-muted ${loading ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                {t("reset_keywords")}
                            </Badge>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Input maxLength={50} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t("placeholder")} />
                        <Button onClick={() => handleSend()} disabled={loading}>{t("send")}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
