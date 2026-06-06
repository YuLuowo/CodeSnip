"use client";

import { SearchBar } from "@/components/custom/search-bar";
import MultiSelect from "@/components/custom/multi-select";
import {
    Field,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { languageMaps } from "@/configs/maps";

interface SnippetFilterProps {
    onSearch?: (filters: {
        title: string;
        language: string;
        tags: string[];
    }) => void;
}

export default function SnippetFilter({ onSearch }: SnippetFilterProps) {
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const t = useTranslations("SnippetFilter");
    const tTags = useTranslations("SnippetTags");
    const tLanguage = useTranslations("SnippetLanguage");

    const handleSearch = useCallback(async () => {
        setLoading(true);
        onSearch?.({ title, language, tags });
        setLoading(false);
    }, [title, language, tags, onSearch]);

    const handleClear = useCallback(() => {
        setTitle("");
        setLanguage("");
        setTags([]);
        onSearch?.({ title: "", language: "", tags: [] });
    }, [onSearch]);

    const handleTitleChange = useCallback((value: string) => {
        setTitle(value);
    }, []);

    const handleLanguageChange = useCallback((val: string) => {
        setLanguage(val);
    }, []);

    const handleTagsChange = useCallback((vals: string[]) => {
        setTags(vals);
    }, []);

    return (
        <div className="flex flex-col gap-4 border rounded-lg border-accent p-4">
            <h2 className="text-2xl font-semibold">{t("title")}</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <Field className="md:max-w-xs">
                    <SearchBar value={title} onChange={handleTitleChange} />
                </Field>

                <Field className="md:max-w-xs">
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder={tLanguage("choose_language")} />
                        </SelectTrigger>
                        <SelectContent className="max-h-100">
                            {Object.entries(languageMaps).map(([groupKey, languages], index) => (
                                <React.Fragment key={groupKey}>
                                    {index > 0 && <SelectSeparator />}

                                    <SelectGroup>
                                        <SelectLabel>
                                            {tLanguage(`select.${groupKey}`)}
                                        </SelectLabel>

                                        {Object.entries(languages).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </React.Fragment>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <Field>
                <FieldLabel>{tTags("title")}</FieldLabel>
                <MultiSelect value={tags} onChange={handleTagsChange} />
            </Field>

            <div className="flex justify-end items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {t("search")}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleClear}
                    disabled={loading}
                >
                    {t("clear")}
                </Button>
            </div>
        </div>
    );
}
