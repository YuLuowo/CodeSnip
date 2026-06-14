"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import SnippetTags from "@/components/custom/snippet-tags";
import LikeButton from "@/components/custom/like-button";
import React from "react";
import { useTranslations } from "use-intl";
import { utcToLocalDate } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface SnippetCardProps {
    snippet: {
        _id: string;
        title: string;
        isPublic: boolean;
        language: string;
        tags: string[];
        author: {
            name: string;
            image?: string;
        };
        likes: string[];
        likesCount: number;
        updatedAt: string;
    };
    userId?: string;
    children?: React.ReactNode;
    avatar?: boolean;
}

export default function SnippetCard({ snippet, userId, children, avatar }: SnippetCardProps) {

    const tStatus = useTranslations("SnippetStatus");

    return (
        <div className="flex flex-col md:flex-row justify-between item-start md:items-center p-3 md:p-4 border rounded-sm bg-background hover:bg-accent/20 cursor-pointer">
            <Link
                href={`/snippets/${snippet._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 pr-0 md:pr-2 flex-1"
            >
                <h3 className="text-sm md:text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        {  avatar && (
                            <Avatar size="sm">
                                <AvatarImage
                                    src={snippet.author?.image}
                                    alt={snippet.author?.name}
                                />
                            </Avatar>
                        )}
                        <span className="text-blue-500 hover:underline">
                            { avatar && snippet.author.name + '/' }{ snippet.title }
                        </span>
                        <Badge className="hidden md:flex" variant="outline">
                            <span className="text-gray-500 font-semibold">{snippet.isPublic ? tStatus("public") : tStatus("private")}</span>
                        </Badge>
                    </div>
                </h3>
                <div className="flex flex-col items-start w-full gap-2 md:gap-2 mt-1">
                    <SnippetTags language={snippet.language} tags={snippet.tags} />
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                        <Badge className="flex md:hidden" variant="outline">
                            <span className="text-gray-500 font-semibold">{snippet.isPublic ? tStatus("public") : tStatus("private")}</span>
                        </Badge>
                        <div className="flex gap-3 md:gap-4">
                            {children}
                            <span className="text-xs md:text-sm text-gray-500">{tStatus("updated")} {utcToLocalDate(snippet.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
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