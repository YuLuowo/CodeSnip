"use client";

import { ISnippetClient } from "@/configs/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/custom/common/code-block";
import { Sparkles, Heart, ArrowUpRight, Code as CodeIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "use-intl";
import { getLanguageLabel } from "@/configs/maps";
import { ShineBorder } from "@/components/ui/shine-border";

export type SnippetReason = { title: string; reason: string };

interface AssistantPreviewPanelProps {
    snippets: ISnippetClient[];
    reasons: SnippetReason[];
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
}

export function AssistantPreviewPanel({ snippets, reasons, activeIndex, onActiveIndexChange }: AssistantPreviewPanelProps) {
    const t = useTranslations("AssistantPage.preview");
    const tTags = useTranslations("SnippetTags.tags");

    if (!snippets.length) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center text-muted-foreground">
                <CodeIcon className="h-10 w-10 opacity-40" />
                <p className="text-sm">{t("empty")}</p>
            </div>
        );
    }

    const activeSnippet = snippets[activeIndex] ?? snippets[0];
    const activeReason = reasons.find((r) => r.title === activeSnippet.title)?.reason;

    return (
        <Tabs
            value={String(activeIndex)}
            onValueChange={(v) => onActiveIndexChange(Number(v))}
            className="flex h-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border p-3 sm:p-4"
        >
            <TabsList className="w-full justify-start flex-nowrap overflow-x-auto min-h-8 overflow-y-hidden">
                {snippets.map((s, i) => (
                    <TabsTrigger
                        key={String(s._id)}
                        value={String(i)}
                        className="min-w-0 shrink-0 basis-auto max-w-[150px] cursor-pointer"
                        title={s.title}
                    >
                        <span className="text-sm truncate">{s.title}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {snippets.map((s, i) => (
                <TabsContent key={String(s._id)} value={String(i)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold">{s.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" /> {s.likesCount ?? s.likes?.length ?? 0}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={s.author?.image} alt={s.author?.name} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    {s.author?.name}
                                </span>
                            </div>
                        </div>
                        {s.desc && <p className="text-sm text-muted-foreground">{s.desc}</p>}
                        <div className="flex flex-wrap gap-1.5">
                            {s.language && <Badge>{getLanguageLabel(s.language)}</Badge>}
                            {s.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">{tTags(tag)}</Badge>
                            ))}
                        </div>
                    </div>

                    {activeReason && i === activeIndex && (
                        <div className="relative flex gap-2 rounded-lg border bg-muted/40 p-3 text-sm w-full overflow-hidden">
                            <ShineBorder shineColor={["#A78BFA", "#F472B6", "#FB923C"]} duration={20} />
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-muted-foreground">{activeReason}</p>
                        </div>
                    )}

                    <CodeBlock code={s.code} language={s.language} maxHeight="420px" />

                    <Button asChild variant="outline" className="self-start">
                        <Link href={`/snippets/${s._id}`} target="_blank">
                            {t("view_full")} <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </TabsContent>
            ))}
        </Tabs>
    );
}
