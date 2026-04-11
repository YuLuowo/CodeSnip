"use client";

import {useEffect, useState} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "use-intl";

interface MultiSelectProps {
    value?: string[];
    onChange?: (selected: string[]) => void;
    defaultSelected?: string[];
}

export default function MultiSelect({ value, onChange, defaultSelected = [] }: MultiSelectProps) {
    const t = useTranslations("SnippetTags.tags");

    const items = [
        { id: "Algorithm", label: t("algorithm") },
        { id: "Data Structure", label: t("data_structure") },
        { id: "UI Component", label: t("ui_component") },
        { id: "Template", label: t("template") },
        { id: "LeetCode", label: t("leetCode") },
        { id: "Project Template", label: t("project_template") },
        { id: "Examples", label: t("examples") },
        { id: "Learning Resources", label: t("learning_resources") },
        { id: "Frontend", label: t("frontend") },
        { id: "Backend", label: t("backend") },
    ] as const;

    const [selectedItems, setSelectedItems] = useState<string[]>(value ?? defaultSelected);

    const handleToggle = (id: string) => {
        const updated = selectedItems.includes(id)
            ? selectedItems.filter((item) => item !== id)
            : [...selectedItems, id];

        setSelectedItems(updated);

        if (onChange) onChange(updated);
    };

    useEffect(() => {
        if (value !== undefined) {
            setSelectedItems(value);
        }
    }, [value]);

    useEffect(() => {
        if (onChange) {
            onChange(selectedItems);
        }
    }, [selectedItems, onChange]);

    return (
        <div>
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-start gap-4">
                {items.map((item) => (
                    <label
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleToggle(item.id)}
                        />
                        <span className="text-sm">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

    );
}
