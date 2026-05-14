"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import SnippetTags from "@/components/custom/snippet-tags";
import LikeButton from "@/components/custom/like-button";
import React from "react";
import { useTranslations } from "use-intl";
import { utcToLocalDate } from "@/lib/utils";

interface SnippetCardProps {
    snippet: {
        _id: string;
        title: string;
        isPublic: boolean;
        language: string;
        tags: string[];
        likes: string[];
        updatedAt: string;
    };
    userId?: string;
    children?: React.ReactNode;
}

export default function SnippetCard({ snippet, userId, children }: SnippetCardProps) {

    const tStatus = useTranslations("SnippetStatus");

    return (
        <div className="flex justify-between items-center p-4 border rounded-sm bg-background hover:bg-accent/20 cursor-pointer">
            <Link
                href={`/snippets/${snippet._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-2 pr-2 flex-1"
            >
                <h3 className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        {snippet.title}
                        <Badge className="hidden md:flex" variant="outline">
                            <span className="text-gray-500 font-semibold">{snippet.isPublic ? tStatus("public") : tStatus("private")}</span>
                        </Badge>
                    </div>
                </h3>
                <div className="flex flex-col md:flex-row items-start w-full md:items-center gap-3 md:gap-6 mt-1 md:mt-2">
                    <SnippetTags language={snippet.language} tags={snippet.tags} />
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                        <Badge className="flex md:hidden" variant="outline">
                            <span className="text-gray-500 font-semibold">{snippet.isPublic ? tStatus("public") : tStatus("private")}</span>
                        </Badge>
                        <div className="flex gap-3 md:gap-6">
                            <span className="text-sm text-gray-500">{tStatus("updated")} {utcToLocalDate(snippet.updatedAt)}</span>
                            {children}
                        </div>
                    </div>

                </div>
            </Link>

            <div className="flex items-center gap-2">
                <LikeButton
                    showFavoriteCount={false}
                    snippetId={String(snippet._id)}
                    initialLikes={snippet.likes}
                    userId={userId}
                />
            </div>
        </div>
    );
}