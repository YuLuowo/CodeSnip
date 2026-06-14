"use client"

import MultiSelect from "@/components/custom/multi-select";
import { Field, FieldDescription, FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";
import { languageMaps } from "@/configs/maps";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "use-intl";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export default function SideFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const selectedTags = searchParams.getAll("tag");
    const selectedLanguages = searchParams.getAll("language");

    const t = useTranslations("SearchSnippet.side_filter");
    const tLanguage = useTranslations("SnippetLanguage");

    const handleTagChange = (tags: string[]) => {
        const params = new URLSearchParams(searchParams);

        params.delete("tag");

        tags.forEach((tag) => {
            params.append("tag", tag);
        });

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleLanguagesChange = (languages: string[]) => {
        const params = new URLSearchParams(searchParams);

        params.delete("language");

        languages.forEach((language) => {
            params.append("language", language);
        });

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="flex-[1] flex flex-col border border-accent rounded-sm max-h-screen p-4 overflow-auto">
                <h4 className="text-xl font-semibold">{t("filter_by")}</h4>
                <FieldSet className="pt-2 md:pt-6">
                    <FieldGroup className="gap-2 md:gap-4">
                        <FieldSeparator />
                        <Field>
                            <div className="hidden md:flex flex-col gap-4">
                                <FieldDescription>{t("tags")}</FieldDescription>
                                <MultiSelect grid="row" value={selectedTags} onChange={handleTagChange} />
                            </div>
                            <div className="flex md:hidden">
                                <Collapsible className="rounded-md data-[state=open]:bg-muted p-1 w-full">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="group w-full">
                                            <h3 className="text font-semibold">
                                                {t("tags")}
                                            </h3>
                                            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="flex flex-col items-start gap-4 p-2.5 pt-1 text-sm">
                                        <MultiSelect grid="row" value={selectedTags} onChange={handleTagChange} />
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </Field>

                        <FieldSeparator className="hidden md:flex" />

                        <Field className="gap-2">
                            {
                                Object.entries(languageMaps).map(([groupKey, languages]) => (
                                    <div key={groupKey}>
                                        <Collapsible className="rounded-md data-[state=open]:bg-muted pt-0 md:pt-1 p-1">
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" className="group w-full">
                                                    <h3 className="text font-semibold">
                                                        {tLanguage(`select.${groupKey}`)}
                                                    </h3>
                                                    <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="flex flex-col items-start gap-2 md:gap-4 p-2.5 pt-1 text-sm">
                                                {Object.entries(languages).map(([value, label]) => (
                                                    <label
                                                        key={value}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Checkbox
                                                            id={value}
                                                            checked={selectedLanguages.includes(value)}
                                                            onCheckedChange={(checked) => {
                                                                const newLanguages =
                                                                    checked === true
                                                                        ? [...selectedLanguages, value]
                                                                        : selectedLanguages.filter(
                                                                            (language) => language !== value
                                                                        );

                                                                handleLanguagesChange(newLanguages);
                                                            }}
                                                        />

                                                        <span className="text-sm">{label}</span>
                                                    </label>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                ))
                            }
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>
        </>

    )
}