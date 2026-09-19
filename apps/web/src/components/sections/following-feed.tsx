"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "use-intl";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import FeedItem from "@/components/custom/snippet/feed-item";
import { ISnippetClient, SnippetsResponse } from "@/configs/types";

export function FollowingFeed() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [isFollowingAnyone, setIsFollowingAnyone] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });

    const t = useTranslations("Dashboard.feed");

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchFeed = async () => {
            setLoading(true);

            try {
                const res = await fetch(`/api/snippets?scope=following&sort=latest&page=${pagination.page}`);
                if (!res.ok) throw new Error("Failed to fetch following feed");

                const data: SnippetsResponse = await res.json();

                setSnippets(data.data);
                setPagination({
                    page: data.pagination.page,
                    totalPages: data.pagination.totalPages,
                });

                if (data.pagination.page === 1) {
                    setIsFollowingAnyone(data.pagination.total > 0 || data.data.length > 0);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [session?.user?.id, pagination.page]);

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">{t("title")}</h3>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex flex-col rounded-lg border bg-card p-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex gap-3 pb-6 last:pb-0">
                                <Skeleton className="size-8 rounded-full shrink-0" />
                                <div className="flex-1 flex flex-col gap-2 pt-0.5">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : snippets.length === 0 && !isFollowingAnyone ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <UserPlus />
                            </EmptyMedia>
                            <EmptyTitle>{t("empty_no_following.title")}</EmptyTitle>
                            <EmptyDescription>
                                {t("empty_no_following.desc")}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Link href="/search?sort=popular">
                                <Button size="sm" className="hover:cursor-pointer">
                                    {t("empty_no_following.action")}
                                </Button>
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : snippets.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <UserPlus />
                            </EmptyMedia>
                            <EmptyTitle>{t("empty_no_snippets.title")}</EmptyTitle>
                            <EmptyDescription>
                                {t("empty_no_snippets.desc")}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Link href="/search?sort=popular">
                                <Button size="sm" className="hover:cursor-pointer">
                                    {t("empty_no_snippets.action")}
                                </Button>
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <>
                        <div className="rounded-lg border bg-card p-4">
                            {snippets.map((snippet, index) => (
                                <FeedItem
                                    key={String(snippet._id)}
                                    snippet={snippet}
                                    isLast={index === snippets.length - 1}
                                />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    disabled={pagination.page <= 1}
                                    onClick={() =>
                                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                                    }
                                >
                                    {t("prev")}
                                </Button>

                                <span className="text-sm text-muted-foreground">
                                    {pagination.page} / {pagination.totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() =>
                                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                                    }
                                >
                                    {t("next")}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
