"use client"

import { FileText, Heart, MessageSquareText, Search, Shapes, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "use-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import SnippetCard from "@/components/custom/snippet/card";
import SnippetCardSkeleton from "@/components/custom/snippet/card-skeleton";
import { ISnippetClient, SnippetsResponse } from "@/configs/types";

const AI_RESOURCE_TYPES = [
    {
        value: "all",
        icon: Shapes,
    },
    {
        value: "ai-context",
        icon: FileText,
    },
    {
        value: "prompt-template",
        icon: MessageSquareText,
    },
    {
        value: "other",
        icon: Shapes,
    },
] as const;

export default function AiResources() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeType = searchParams.get("type") ?? "all";
    const activeSort = searchParams.get("sort") ?? "latest";
    const activeQuery = searchParams.get("q") ?? "";

    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

    const t = useTranslations("AiResources");

    function handleTypeChange(type: string) {
        const params = new URLSearchParams(searchParams);

        if (type === "all") {
            params.delete("type");
        } else {
            params.set("type", type);
        }

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    }

    function changePage(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        router.push(`${pathname}?${params.toString()}`);
    }

    function handleSortChange(sort: string) {
        const params = new URLSearchParams(searchParams);
        params.set("sort", sort);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    function handleSearchSubmit(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);

        if (searchInput.trim()) {
            params.set("q", searchInput.trim());
        } else {
            params.delete("q");
        }

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    function clearSearch() {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        params.set("page", "1");
        setSearchInput("");
        router.push(`${pathname}?${params.toString()}`);
    }

    useEffect(() => {
        setSearchInput(searchParams.get("q") ?? "");
    }, [searchParams]);

    useEffect(() => {
        const fetchSnippets = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams(searchParams);
                params.set("isAiDoc", "true");

                const type = params.get("type");
                if (type && type !== "all") {
                    params.set("aiDocType", type);
                }
                params.delete("type");

                if (!params.get("sort")) {
                    params.set("sort", "latest");
                }

                const res = await fetch(`/api/snippets?${params.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch snippets");

                const data: SnippetsResponse = await res.json();

                setSnippets(data.data);
                setPagination(data.pagination);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, [searchParams]);

    return (
        <section className="flex flex-col gap-6 w-full max-w-5xl p-4 pt-8 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{t("title")}</h1>
                    <p className="text-sm text-muted-foreground">{t("desc")}</p>
                </div>
                <Link href="/assistant">
                    <Button variant="outline" className="cursor-pointer gap-2 shrink-0">
                        <Sparkles className="size-4" />
                        {t("ask_assistant")}
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {AI_RESOURCE_TYPES.filter((type) => type.value !== "all").map(({ value, icon: Icon }) => (
                    <Card
                        key={value}
                        onClick={() => handleTypeChange(value)}
                        className={`p-0 gap-0 cursor-pointer transition-colors hover:bg-accent/40 ${
                            activeType === value ? "border-foreground/60" : ""
                        }`}
                    >
                        <CardContent className="flex items-start gap-3 p-4">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-accent shrink-0">
                                <Icon className="size-5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-semibold text-sm">{t(`types.${value}.title`)}</span>
                                <span className="text-xs text-muted-foreground">{t(`types.${value}.desc`)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={t("search_placeholder")}
                        className="pl-8 pr-8"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </form>

                <Select value={activeSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">{t("sort.latest")}</SelectItem>
                        <SelectItem value="popular">{t("sort.popular")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs value={activeType} onValueChange={handleTypeChange}>
                <TabsList>
                    {AI_RESOURCE_TYPES.map(({ value }) => (
                        <TabsTrigger key={value} value={value} className="cursor-pointer">
                            {t(`types.${value}.title`)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {activeQuery && (
                    <div className="flex justify-between items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <span>
                            {t("search_results_for", { query: activeQuery })}
                        </span>
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="flex items-center gap-1 text-foreground cursor-pointer"
                        >
                            <X className="size-3.5" />
                            {t("clear_filter")}
                        </button>
                    </div>
                )}

                <TabsContent value={activeType} className="mt-4">
                    <div className="grid gap-4">
                        {loading ? (
                            <div className="grid gap-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <SnippetCardSkeleton key={index} avatar likes />
                                ))}
                            </div>
                        ) : snippets.length === 0 ? (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Shapes />
                                    </EmptyMedia>
                                    <EmptyTitle>{t("empty")}</EmptyTitle>
                                    <EmptyDescription>{t("empty_desc")}</EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link href="/snippets/create">
                                            <Button size="sm" variant="outline" className="cursor-pointer w-full">
                                                {t("empty_create")}
                                            </Button>
                                        </Link>
                                        <Link href="/assistant">
                                            <Button size="sm" className="cursor-pointer w-full">
                                                {t("ask_assistant")}
                                            </Button>
                                        </Link>
                                    </div>
                                </EmptyContent>
                            </Empty>
                        ) : (
                            <>
                                {snippets.map((snippet) => (
                                    <SnippetCard
                                        key={String(snippet._id)}
                                        snippet={snippet}
                                        userId={session?.user?.id}
                                        avatar
                                    >
                                        <div className="flex items-center gap-1">
                                            <Heart color="#6a7282" className="size-3 md:size-4" />
                                            <span className="text-xs md:text-sm text-gray-500">
                                                {snippet.likesCount}
                                            </span>
                                        </div>
                                    </SnippetCard>
                                ))}

                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-3 pt-6">
                                        <Button
                                            variant="outline"
                                            disabled={pagination.page <= 1}
                                            onClick={() => changePage(pagination.page - 1)}
                                        >
                                            {t("prev")}
                                        </Button>

                                        <span className="text-sm text-muted-foreground">
                                            {pagination.page} / {pagination.totalPages}
                                        </span>

                                        <Button
                                            variant="outline"
                                            disabled={pagination.page >= pagination.totalPages}
                                            onClick={() => changePage(pagination.page + 1)}
                                        >
                                            {t("next")}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
}
