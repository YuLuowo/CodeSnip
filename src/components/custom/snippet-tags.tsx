"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "use-intl";
import { capitalizeFirstLetter, tagMap } from "@/lib/utils";

interface SnippetTagsProps {
    language: string;
    tags?: string[];
}

export default function SnippetTags({ language, tags = [] }: SnippetTagsProps) {
    const t = useTranslations("SnippetTags");

    if (!language && tags.length === 0) return null;


    return (
        <div className="flex flex-wrap max-w-xl gap-2">
            {language && <Badge>{capitalizeFirstLetter(language)}</Badge>}
            {tags.map((tag) => {
                const key = tagMap[tag] || tag;
                return (
                    <Badge variant="secondary" key={tag}>
                        {t(`tags.${key}`)}
                    </Badge>
                );
            })}
        </div>
    );
}
