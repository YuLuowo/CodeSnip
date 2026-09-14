"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Code, Search } from "lucide-react";
import { useTranslations } from "use-intl";
import { useSearchCommand } from "@/components/providers/search-command-provider";
import { Kbd } from "@/components/ui/kbd";
import { ISnippetClient, SnippetsResponse } from "@/configs/types";
import { fetcher } from "@/lib/fetcher";

export function SearchCommand() {
    const { open, setOpen } = useSearchCommand();
    const t = useTranslations("SearchCommand");
    const router = useRouter();
    const { data: session } = useSession();

    const [keyword, setKeyword] = React.useState("");
    const [mySnippets, setMySnippets] = React.useState<ISnippetClient[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setKeyword("");
            return;
        }

        if (!session?.user?.id) return;

        async function fetchMySnippets() {
            setLoading(true);
            try {
                const data = await fetcher<SnippetsResponse>("/api/snippets?scope=me&sort=latest&limit=3");

                setMySnippets(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMySnippets();
    }, [open, session?.user?.id]);

    function goToSnippet(id: string) {
        setOpen(false);
        router.push(`/snippets/${id}`);
    }

    function handleSearch() {
        if (!keyword.trim()) return;

        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(keyword.trim())}&page=1`);
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Button onClick={() => setOpen(true)} variant="outline" size="sm" className="w-fit h-8 cursor-pointer">
                <Search />
                <div className="flex gap-0.5 items-center text-muted-foreground">
                    {t("title")}<Kbd>/</Kbd>{t("title2")}
                </div>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput
                        placeholder={t("placeholder")}
                        value={keyword}
                        onValueChange={setKeyword}
                        onKeyDown={handleInputKeyDown}
                    />
                    <CommandList>
                        {session?.user?.id && (
                            <CommandGroup heading={t("my_snippets")}>
                                {loading ? (
                                    <CommandItem disabled>{t("loading")}</CommandItem>
                                ) : mySnippets.length === 0 ? (
                                    <CommandItem disabled>{t("empty")}</CommandItem>
                                ) : (
                                    mySnippets.map((snippet) => (
                                        <CommandItem
                                            key={snippet._id}
                                            value={snippet.title}
                                            onSelect={() => goToSnippet(snippet._id)}
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Code />
                                                {snippet.title}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{t("jump_to")}</span>
                                        </CommandItem>
                                    ))
                                )}
                            </CommandGroup>
                        )}
                        <CommandEmpty>
                            <div
                                onClick={handleSearch}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center px-3 gap-2">
                                    <Search size={16} className="text-muted-foreground" />
                                    {keyword}
                                </div>
                                <span className="text-xs text-muted-foreground pr-4">{t("search_all")}</span>
                            </div>
                        </CommandEmpty>
                    </CommandList>
                </Command>
            </CommandDialog>
        </div>
    )
}