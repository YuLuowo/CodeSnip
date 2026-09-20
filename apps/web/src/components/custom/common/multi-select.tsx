"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "use-intl";
import { tagKeys } from "@/configs/maps";

interface MultiSelectProps {
    value?: string[];
    onChange?: (selected: string[]) => void;
    grid?: string;
}

export default function MultiSelect({ value = [], onChange, grid = "col" }: MultiSelectProps) {
    const t = useTranslations("SnippetTags.tags");

    const items = tagKeys.map((id) => ({ id, label: t(id) }));

    const handleToggle = (id: string) => {
        const updated = value.includes(id)
            ? value.filter((item) => item !== id)
            : [...value, id];

        onChange?.(updated);
    };

    const className = (grid === "col")
        ? "w-full grid grid-cols-2 lg:grid-cols-4 items-start gap-2 md:gap-4"
        : "w-full grid grid-rows-2 lg:grid-rows-4 items-start gap-2 md:gap-4";

    return (
        <div>
            <div className={className}>
                {items.map((item) => (
                    <label
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Checkbox
                            checked={value.includes(item.id)}
                            onCheckedChange={() => handleToggle(item.id)}
                        />
                        <span className="text-sm">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

    );
}
