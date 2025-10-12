"use client";

import { Badge } from "@/components/ui/badge";

interface SnippetTagsProps {
    language: string;
    tags?: string[];
}

export default function SnippetTags({ language, tags = [] }: SnippetTagsProps) {
    if (!language && tags.length === 0) return null;

    const capitalizeFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {language && <Badge>{capitalizeFirstLetter(language)}</Badge>}
            {tags.map((tag) => (
                <Badge variant="secondary" key={tag}>
                    {tag}
                </Badge>
            ))}
        </div>
    );
}
