"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "use-intl";
import { getLanguageLabel } from "@/configs/maps";

interface SnippetTagsProps {
    language: string;
    tags?: string[];
}

export default function SnippetTags({ language, tags = [] }: SnippetTagsProps) {
    const t = useTranslations("SnippetTags");

    if (!language && tags.length === 0) return null;


    return (
        <div className="flex flex-wrap max-w-xl gap-2">
            {language && <Badge>{getLanguageLabel(language)}</Badge>}
            {tags.map((tag) => (
                <Badge variant="secondary" key={tag}>
                    {t(`tags.${tag}`)}
                </Badge>
            ))}
        </div>
    );
}
