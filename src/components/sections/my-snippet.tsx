"use client";

import { useEffect, useState } from "react";
import SnippetFilter from "@/components/custom/snippet-filter";
import { useSession } from "next-auth/react";
import {Spinner} from "@/components/ui/spinner";
import {Badge} from "@/components/ui/badge";
import {capitalizeFirstLetter} from "@/lib/utils";
import {FolderCode, Heart, HeartPlus, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {IUser} from "@/models/User";
import {redirect, useRouter} from "next/navigation";
import SnippetTags from "@/components/custom/snippet-tags";
import LikeButton from "@/components/custom/like-button";

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

export function MySnippet() {
    const {data: session} = useSession();
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [filteredSnippets, setFilteredSnippets] = useState<ISnippetClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        title: "",
        language: "",
        tags: [] as string[],
    });
    const router = useRouter();

    const [fetched, setFetched] = useState(false); // TODO: 記得刪掉
    useEffect(() => {
        const fetchSnippets = async () => {
            if (!session?.user?.id || fetched) return;

            setFetched(true);
            setLoading(true);

            try {
                const res = await fetch("/api/snippets");
                if (!res.ok) throw new Error("Failed to fetch snippets");

                const data: ISnippetClient[] = await res.json();

                const mySnippets = data.filter(
                    (snippet) => snippet.author?._id === session.user.id
                );

                setSnippets(mySnippets);
                setFilteredSnippets(mySnippets);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, [session, fetched]);

    const handleSearch = async (newFilters: typeof filters) => {
        setLoading(true);
        setFilters(newFilters);

        const filtered = snippets.filter((snippet) => {
            const matchesTitle =
                !newFilters.title ||
                snippet.title.toLowerCase().includes(newFilters.title.toLowerCase());
            const matchesLanguage =
                !newFilters.language || snippet.language === newFilters.language;
            const matchesTags =
                newFilters.tags.length === 0 ||
                newFilters.tags.every((tag) => snippet.tags.includes(tag));

            return matchesTitle && matchesLanguage && matchesTags;
        });

        setFilteredSnippets(filtered);
        setLoading(false);
    };

    return (
        <section>
            <SnippetFilter onSearch={handleSearch}/>
            <div className="flex justify-between mt-6 mb-3">
                <h3 className="text-2xl font-semibold">My Snippets</h3>
                <Link href="/create">
                    <Button variant="outline" className="cursor-pointer">
                        <Plus />
                        Create new snippet
                    </Button>
                </Link>
            </div>
            <Separator />
            <div className="w-full max-w-5xl grid items-center my-4 gap-4">
                {loading ? (
                    <div className="flex items-center justify-center mt-4">
                        <Spinner className="size-10" />
                    </div>
                ) : snippets.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderCode />
                            </EmptyMedia>
                            <EmptyTitle>No Snippets</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t created any code snippets yet. Get started by creating
                                your first snippet.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Link href="/create">
                                <Button className="hover:cursor-pointer">Create Snippet</Button>
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : filteredSnippets.length === 0 ? (
                    <p className="text-muted-foreground">
                        No snippets found
                        {filters.title && ` for "${filters.title}"`}
                        {filters.language && ` in ${capitalizeFirstLetter(filters.language)}`}
                        {filters.tags.length > 0 && ` with tags ${filters.tags.join(", ")}`}
                        .
                    </p>
                ) : (
                    filteredSnippets.map((snippet) => {
                        return (
                            <div
                                key={String(snippet._id)}
                                className="flex justify-between items-center p-4 border rounded-sm bg-background hover:bg-accent/20 hover:cursor-pointer"
                                onClick={() => router.push(`/snippets/${snippet._id}`)}
                            >
                                <div className="flex flex-col gap-2 pr-2">
                                    <h3 className="text-lg font-semibold">{snippet.title}</h3>
                                    <SnippetTags language={snippet.language} tags={snippet.tags} />
                                </div>

                                <LikeButton
                                    snippetId={String(snippet._id)}
                                    initialLikes={snippet.likes}
                                    userId={session?.user?.id}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    )
}