"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISnippetClient } from "@/configs/types";
import { BookOpen, Clock, Heart } from "lucide-react";
import { utcToLocalDate } from "@/lib/utils";
import { useTranslations } from "use-intl";

interface AiDocSnippetPreviewCardProps {
    snippet: ISnippetClient;
}

export function AiDocSnippetPreviewCard({ snippet }: AiDocSnippetPreviewCardProps) {
    const t = useTranslations("AiDocPage.card");
    const tTags = useTranslations("SnippetTags.tags");

    return (
        <Card className="hover:shadow-lg transition-shadow flex flex-col py-0">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm sm:text-md font-semibold truncate flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary shrink-0" />
                    <Link href={`/snippets/${snippet._id}`} target="_blank" className="hover:text-blue-500 truncate">
                        {snippet.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <div className="flex flex-wrap gap-1 mt-2">
                    {snippet.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                            {tTags(tag)}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <div className="p-3 border-t mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3">
                <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{snippet.likesCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="truncate">{t("updated")} {utcToLocalDate(snippet.updatedAt)}</span>
                </div>
            </div>
        </Card>
    );
}
