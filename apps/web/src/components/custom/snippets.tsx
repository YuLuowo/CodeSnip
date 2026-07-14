"use client"

import { Heart, Search, X } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ISnippetClient } from "@/configs/types";
import { Spinner } from "@/components/ui/spinner";
import SnippetCard from "@/components/custom/snippet-card";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "use-intl";
import SnippetCardSkeleton from "@/components/custom/snippet-card-skeleton";

export default function Snippets() {
    const {data: session} = useSession();
    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);

    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });

    const hasFilters =
        searchParams.getAll("tag").length > 0 ||
        searchParams.getAll("language").length > 0 ||
        searchParams.get("q");

    const t = useTranslations("SearchSnippet.snippets");

    function handleVectorSearch() {
        const params = new URLSearchParams(searchParams);

        if (inputValue.trim()) {
            params.set("q", inputValue);
        } else {
            params.delete("q");
        }

        router.push(`${pathname}?${params.toString()}`);
    }

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", String(page));

        router.push(`${pathname}?${params.toString()}`);
    };

    function clearFilters(keys: string[]) {
        const params = new URLSearchParams(searchParams);

        keys.forEach((key) => params.delete(key));

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    }

    const handleClearFilters = () => {
        clearFilters(["tag", "language", "q"]);
    }

    useEffect(() => {
        const fetchSnippets = async () => {
            setLoading(true);
            try {
                const queryString = searchParams.toString();
                const res = await fetch(`/api/snippets?${queryString}`);
                if (!res.ok) throw new Error("Failed to fetch snippets");

                const data = await res.json();

                if (data.pagination.totalPages > 0 && data.pagination.page > data.pagination.totalPages) {
                    router.replace(`/search?page=${data.pagination.totalPages}`);
                    return;
                }

                setSnippets(data.data);
                setPagination(data.pagination);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, [router, searchParams]);

    return (
        <div className="flex-[3] border border-accent rounded-sm min-h-screen">
            <div className="flex flex-col gap-4 p-4 pb-0">
                <div className="flex items-center justify-between gap-4">
                    <InputGroup>
                        <InputGroupInput
                            placeholder={t("placeholder")}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>

                    <Button variant="outline" className="cursor-pointer" onClick={handleVectorSearch}>{t("search")}</Button>
                </div>
                {hasFilters && (
                    <div className="flex justify-end">
                        <span className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-400 font-semibold transition-colors cursor-pointer" onClick={handleClearFilters}>
                            <X className="w-4 h-4" /> {t("clear")}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid gap-4 p-4">
                {loading ? (
                    <div className="grid gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <SnippetCardSkeleton
                                key={index}
                                avatar
                                likes
                            />
                        ))}
                    </div>
                ) : snippets.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        {t("not_found")}
                    </div>
                ) : (
                    <>
                        {snippets.map((snippet) => (
                            <SnippetCard
                                key={String(snippet._id)}
                                snippet={snippet}
                                userId={session?.user?.id}
                                avatar={true}
                            >
                                <div className="flex items-center gap-1">
                                    <Heart
                                        color="#6a7282"
                                        className="size-3 md:size-4"
                                    />
                                    <span className="text-xs md:text-sm text-gray-500">
                                        {snippet.likesCount}
                                    </span>
                                </div>
                            </SnippetCard>
                        ))}

                        <div className="flex items-center justify-center gap-3 pt-6 col-span-full">
                            <Button
                                variant="outline"
                                disabled={pagination.page <= 1}
                                onClick={() =>
                                    changePage(pagination.page - 1)
                                }
                            >
                                {t("prev")}
                            </Button>

                            <span className="text-sm text-muted-foreground">
                                {pagination.page} / {pagination.totalPages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={
                                    pagination.page >= pagination.totalPages
                                }
                                onClick={() =>
                                    changePage(pagination.page + 1)
                                }
                            >
                                {t("next")}
                            </Button>
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}