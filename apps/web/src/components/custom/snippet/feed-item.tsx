"use client";

import Link from "next/link";
import { useTranslations } from "use-intl";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, utcToLocalDate } from "@/lib/utils";
import { ISnippetClient } from "@/configs/types";

interface FeedItemProps {
    snippet: ISnippetClient;
    isLast?: boolean;
}

export default function FeedItem({ snippet, isLast }: FeedItemProps) {
    const t = useTranslations("Dashboard.feed");

    return (
        <div className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
                <span className="absolute left-[15px] top-9 bottom-0 w-px bg-border" />
            )}

            <Link
                href={`/users/${snippet.author?.username}`}
                className="relative z-10 shrink-0"
            >
                <Avatar size="sm" className="ring-4 ring-background">
                    <AvatarImage
                        src={snippet.author?.image ?? undefined}
                        alt={snippet.author?.name ?? ""}
                    />
                    <AvatarFallback>
                        {snippet.author?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>

            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm leading-relaxed">
                    <Link
                        href={`/users/${snippet.author?.username}`}
                        className="font-semibold hover:underline"
                    >
                        {snippet.author?.name}
                    </Link>{" "}
                    <span className="text-muted-foreground">{t("uploaded")}</span>{" "}
                    <Link
                        href={`/snippets/${snippet._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-500 hover:underline break-all"
                    >
                        {snippet.title}
                    </Link>
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {snippet.language && (
                        <Badge variant="secondary" className="text-xs">
                            {capitalizeFirstLetter(snippet.language)}
                        </Badge>
                    )}

                    <span className="text-xs text-muted-foreground">
                        {t("uploaded_on")} {utcToLocalDate(snippet.createdAt)}
                    </span>

                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="size-3" />
                        <span className="text-xs">{snippet.likesCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
