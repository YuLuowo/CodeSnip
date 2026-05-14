"use client"

import FavoriteFilter from "@/components/custom/favorite-filter";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IUser } from "@/models/User";
import SnippetCard from "@/components/custom/snippet-card";
import { Heart, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "use-intl";

interface ISnippetClient {
    _id: string;
    title: string;
    language: string;
    code: string;
    tags: string[];
    isPublic: boolean;
    author: IUser;
    likes: string[];
    createdAt: string;
    updatedAt: string;
}

export default function FavoriteSnippet() {
    const {data: session} = useSession();
    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [filtered, setFiltered] = useState<ISnippetClient[]>([]);
    const [hasFilter, setHasFilter] = useState(false);

    // A little ugly, but it works qwq
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("latest");

    useEffect(() => {
        const fetchUserFavorites = async () => {
            if (!session?.user?.id) return;
            setLoading(true);

            try {
                const res = await fetch(`/api/users/${session.user.id}/favorites`);
                if (!res.ok) throw new Error("Failed to fetch favorites");

                const data: {favorites: ISnippetClient[]} = await res.json();

                setSnippets(data.favorites);
                setFiltered(data.favorites);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserFavorites();
    }, [session?.user.id]);

    const handleSearch = (title: string) => {
        setLoading(true);
        setSearchTerm(inputValue);

        let result = [...snippets];

        if (title) {
            result = result.filter((s) =>
                s.title.toLowerCase().includes(title.toLowerCase())
            );
            setHasFilter(true);
        }

        if (sort === "latest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else if (sort === "favorites") {
            result.sort((a, b) => b.likes.length - a.likes.length);
        }

        setFiltered(result);
        setLoading(false);
    };

    const handleSort = (sort: string) => {
        setLoading(true);

        const result = [...filtered];
        if (sort === "latest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else if (sort === "favorites") {
            result.sort((a, b) => b.likes.length - a.likes.length);
        }

        setFiltered(result);
        setLoading(false);
    };

    const handleClear = () => {
        setFiltered(snippets);
        setInputValue("");
        setSearchTerm("");
        setSort("latest");
        setHasFilter(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">我的收藏</h1>
            <FavoriteFilter
                inputValue={inputValue}
                setInputValue={setInputValue}
                sort={sort}
                setSort={setSort}
                onSearch={handleSearch}
                onSort={handleSort}
            />

            {hasFilter && (
                <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    <span>
                        {filtered.length} favorite{filtered.length !== 1 ? "s" : ""}
                        {searchTerm && ` found for "${searchTerm}"`}
                    </span>
                    <span
                        onClick={handleClear}
                        className="cursor-pointer text-sm text-gray-500 hover:text-blue-400 font-semibold transition-colors flex items-center gap-1"
                    >
                        <X className="w-4 h-4" />
                        Clear Filter
                    </span>
                </div>
            )}

            <Separator />
            <div className="grid gap-4 mt-6">
                {loading ? (
                    <div className="flex items-center justify-center mt-4">
                        <Spinner className="size-10"/>
                    </div>
                ) : snippets.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Heart />
                            </EmptyMedia>
                            <EmptyTitle>No Favorite Snippets</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t liked any code snippets yet. Start exploring and find snippets you like.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Link href="/create">
                                <Button size="sm" className="hover:cursor-pointer">Explore Snippet</Button>
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : filtered.length === 0 ? (
                    <span className="text-muted-foreground">No snippets found.</span>
                ) : (
                    filtered.map((snippet) => {
                        return (
                            <SnippetCard key={String(snippet._id)} snippet={snippet} userId={session?.user?.id}>
                                <div className="flex items-center gap-1">
                                    <Heart color="#6a7282" className="size-4" />
                                    <span className="text-sm text-gray-500">{snippet.likes.length}</span>
                                </div>
                            </SnippetCard>
                        );
                    })
                )}
            </div>
        </div>
    )

}