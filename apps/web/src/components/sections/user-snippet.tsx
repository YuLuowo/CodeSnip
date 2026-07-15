"use client"

import { ISnippetClient, SnippetsResponse } from "@/configs/types";
import SnippetCard from "@/components/custom/snippet-card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useTranslations } from "use-intl";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

interface UserSnippetProps {
    userId: string;
}

function UserSnippetSkeleton() {
    return (
        <section className="flex-[3] min-w-0 min-h-screen px-4">
            <div className="flex justify-center items-center pb-4">
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col md:flex-row justify-between item-start md:items-center p-3 md:p-4 border rounded-sm">
                        <div className="flex flex-col gap-2 flex-1">
                            <Skeleton className="h-6 w-1/3" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="hidden md:block">
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function UserSnippet({ userId }: UserSnippetProps) {
    const { data: session } = useSession();
    const [search, setSearch] = useState("");

    const t = useTranslations("SearchSnippet.snippets");

    const { data, isLoading, error } = useSWR<SnippetsResponse>(
        userId ? `/api/snippets?scope=${userId}` : null,
        fetcher
    );

    useEffect(() => {
        if (error) {
            toast.error(t("load_error"));
        }
    }, [error, t]);

    if (isLoading || !data) {
        return <UserSnippetSkeleton />;
    }

    const snippets: ISnippetClient[] = data.data;

    // Simple filter
    const filteredSnippets = snippets.filter((snippet) =>
        snippet.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="flex-[3] min-w-0 min-h-screen px-4">
            <div className="flex justify-center items-center pb-4">
                <InputGroup>
                    <InputGroupInput
                        placeholder={t("placeholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <div className="flex flex-col gap-4">
                {filteredSnippets.map((snippet) => (
                    <SnippetCard
                        key={snippet._id}
                        snippet={snippet}
                        userId={session?.user?.id}
                    />
                ))}
            </div>
        </section>
    );
}