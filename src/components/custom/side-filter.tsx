"use client"

import MultiSelect from "@/components/custom/multi-select";
import { Field, FieldDescription, FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";
import { languageMaps } from "@/configs/maps";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useTranslations } from "use-intl";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";


export default function SideFilter() {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const tLanguage = useTranslations("SnippetLanguage");

    const handleClear = () => {
        setSelectedLanguages([]);
    }

    const handleCheckedChange = (
        language: string,
        checked: boolean
    ) => {
        setSelectedLanguages((prev) =>
            checked
                ? [...prev, language]
                : prev.filter((item) => item !== language)
        );
    };

    return (
        <div className="flex-[1] flex flex-col gap-4 border border-accent rounded-sm min-h-screen p-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold">Filter by</h4>
                {/** Reset Button */}
            </div>

            <FieldSet className="pt-6">
                <FieldGroup>
                    <FieldSeparator />

                    <Field>
                        <FieldDescription>Tags</FieldDescription>
                        <MultiSelect grid="row" />
                    </Field>

                    <FieldSeparator />

                    <Field className="gap-2">
                        {
                            Object.entries(languageMaps).map(([groupKey, languages]) => (
                                <div key={groupKey}>
                                    <Collapsible className="rounded-md data-[state=open]:bg-muted p-1">
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" className="group w-full">
                                                <h3 className="text font-semibold">
                                                    {tLanguage(`select.${groupKey}`)}
                                                </h3>
                                                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="flex flex-col items-start gap-4 p-2.5 pt-1 text-sm">
                                            {Object.entries(languages).map(([value, label]) => (
                                                <label
                                                    key={value}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Checkbox
                                                        id={value}
                                                        checked={selectedLanguages.includes(value)}
                                                        onCheckedChange={(checked) =>
                                                            handleCheckedChange(
                                                                value,
                                                                checked === true
                                                            )
                                                        }
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
    )
}