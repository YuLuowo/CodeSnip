"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "use-intl";
import { FolderCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ISnippetClient, SnippetsResponse } from "@/configs/types";

const COLLAPSED_COUNT = 5;

export function MySnippetsMini() {
    const { data: session } = useSession();
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const t = useTranslations("Dashboard.my_snippets_mini");

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchSnippets = async () => {
            setLoading(true);

            try {
                const res = await fetch(`/api/snippets?scope=me&sort=latest`);
                if (!res.ok) throw new Error("Failed to fetch snippets");

                const data: SnippetsResponse = await res.json();
                setSnippets(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, [session?.user?.id]);

    const visibleSnippets = expanded ? snippets : snippets.slice(0, COLLAPSED_COUNT);

    return (
        <Card className="gap-3">
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2 py-1.5">
                            <Skeleton className="size-6 rounded-full" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))
                ) : snippets.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-4 text-center">
                        <FolderCode className="size-5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{t("empty")}</p>
                    </div>
                ) : (
                    <>
                        {visibleSnippets.map((snippet) => (
                            <Link
                                key={String(snippet._id)}
                                href={`/snippets/${snippet._id}`}
                                className="flex items-center gap-2 py-1.5 rounded-md hover:bg-accent/40 transition-colors -mx-1 px-1"
                            >
                                <Avatar size="sm">
                                    <AvatarImage
                                        src={snippet.author?.image ?? undefined}
                                        alt={snippet.author?.name ?? ""}
                                    />
                                    <AvatarFallback>
                                        {snippet.author?.name?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate">{snippet.title}</span>
                            </Link>
                        ))}

                        {snippets.length > COLLAPSED_COUNT && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 h-7 justify-start px-1 text-xs text-muted-foreground hover:cursor-pointer"
                                onClick={() => setExpanded((prev) => !prev)}
                            >
                                {expanded ? t("show_less") : t("show_more")}
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
