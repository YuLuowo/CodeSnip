"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/custom/search-bar";
import { Button } from "@/components/ui/button";
import { AiDocSnippetPreviewCard } from "@/components/custom/ai-doc-snippet-preview-card";
import { ISnippetClient } from "@/configs/types";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useTranslations } from "use-intl";

export function AiDocSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ISnippetClient[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const t = useTranslations("AiDocPage.search");

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async (searchQuery: string = query) => {
        setLoading(true);
        try {
            const url = searchQuery
                ? `/api/snippets?isAiDoc=true&q=${encodeURIComponent(searchQuery)}`
                : `/api/snippets?isAiDoc=true`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch AiDocs");
            const data = await res.json();
            setResults(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                <SearchBar value={query} onChange={setQuery} />
                <Button onClick={() => handleSearch()} disabled={loading} className="w-full sm:w-auto">
                    {t("search_button")}
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full flex justify-center p-10"><Spinner /></div>
                ) : results.length > 0 ? (
                    results.map((snippet) => (
                        <AiDocSnippetPreviewCard key={String(snippet._id)} snippet={snippet} />
                    ))
                ) : (
                    <p className="col-span-full text-sm sm:text-base">{t("not_found")}</p>
                )}
            </div>
        </section>
    );
}
