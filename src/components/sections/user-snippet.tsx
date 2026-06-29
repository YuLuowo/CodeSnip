"use client"

import { ISnippetClient } from "@/configs/types";
import SnippetCard from "@/components/custom/snippet-card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useTranslations } from "use-intl";

interface UserSnippetProps {
    userId: string;
}

export default function UserSnippet({ userId }: UserSnippetProps) {
    const { data: session } = useSession();
    const [search, setSearch] = useState("");
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [loading, setLoading] = useState(false);

    const t = useTranslations("SearchSnippet.snippets");

    useEffect(() => {
        const fetchUserSnippets = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/snippets?scope=${userId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch snippets");
                }
                const data = await res.json();
                setSnippets(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUserSnippets();
    }, [userId]);

    if (loading || !snippets) {
        return;
    }

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