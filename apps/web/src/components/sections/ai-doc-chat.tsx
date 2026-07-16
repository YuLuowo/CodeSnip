"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ISnippetClient } from "@/configs/types";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { Bot, User, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "use-intl";

type Message = {
    sender: 'user' | 'ai';
    content: string;
    snippets?: ISnippetClient[];
};



export function AiDocChat() {
    const t = useTranslations("AiDocPage.chat");
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', content: t("welcome") }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { data: session } = useSession();

    const QUICK_KEYWORDS = [
        { key: "improve_ui", query: t("quick_keywords.improve_ui") },
        { key: "agent", query: t("quick_keywords.agent") },
        { key: "mcp", query: t("quick_keywords.mcp") },
    ] as const;

    const handleSend = async (overrideQuery?: string) => {
        const query = (overrideQuery ?? input).trim();
        if (!query) return;

        const userMessage: Message = { sender: 'user', content: query };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`/api/snippets?isAiDoc=true&aiDocType=ai-document&q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Failed to search");
            const data = await res.json();

            const snippets: ISnippetClient[] = data.data;
            const aiResponse: Message = {
                sender: 'ai',
                content: snippets.length > 0
                    ? t("found_results", { count: Math.min(snippets.length, 3) })
                    : t("no_results"),
                snippets: snippets.slice(0, 3)
            };
            setMessages((prev) => [...prev, aiResponse]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, { sender: 'ai', content: t("error") }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickKeywordClick = (keyword: string) => {
        if (loading) return;
        handleSend(keyword);
    };

    return (
        <div className="flex flex-col gap-4 border rounded-lg p-3 sm:p-4">
            <Button onClick={() => setIsChatOpen(!isChatOpen)} variant="ghost" className="w-full justify-between">
                <span>{t("title")}</span>
                {isChatOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>

            {isChatOpen && (
                <div className="flex flex-col gap-4 h-[70vh] sm:h-[600px]">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && <Bot className="w-7 h-7 sm:w-8 sm:h-8 p-1.5 bg-muted rounded-full shrink-0" />}
                                <div className={`p-3 rounded-lg max-w-[85%] sm:max-w-[80%] text-sm sm:text-base ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {msg.content}
                                    {msg.snippets && msg.snippets.length > 0 && (
                                        <div className="mt-3 flex flex-col gap-1">
                                            {msg.snippets.map((s) => (
                                                <Link key={String(s._id)} href={`/snippets/${s._id}`} target="_blank" className="text-blue-500 hover:underline block truncate">
                                                    • {s.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {msg.sender === 'user' && <User className="w-7 h-7 sm:w-8 sm:h-8 p-1.5 bg-primary text-primary-foreground rounded-full shrink-0" />}
                            </div>
                        ))}
                        {loading && <div className="flex justify-start gap-2 sm:gap-3"><Bot className="w-7 h-7 sm:w-8 sm:h-8 p-1.5 bg-muted rounded-full shrink-0" /><Spinner /></div>}
                    </div>
                    <div className="flex flex-col gap-4 pt-4 border-t">
                        <div className="flex flex-wrap gap-2">
                            {QUICK_KEYWORDS.map(({ key, query }) => (
                                <Badge
                                    key={key}
                                    variant="secondary"
                                    onClick={() => handleQuickKeywordClick(query)}
                                    className={`cursor-pointer select-none hover:bg-secondary/70 ${loading ? "opacity-50 pointer-events-none" : ""}`}
                                >
                                    {t(`quick_keywords.${key}`)}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input maxLength={50} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t("placeholder")} />
                            <Button onClick={() => handleSend()} disabled={loading}>{t("send")}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
