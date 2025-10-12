"use client";

import {useEffect, useState} from "react";
import { Checkbox } from "@/components/ui/checkbox";

const items = [
    { id: "Algorithm", label: "Algorithm" },
    { id: "Data Structure", label: "Data Structure" },
    { id: "UI Component", label: "UI Component" },
    { id: "Template", label: "Template" },
    { id: "LeetCode", label: "LeetCode" },
    { id: "Project Template", label: "Project Template" },
    { id: "Examples", label: "Examples" },
    { id: "Learning Resources", label: "Learning Resources" },
    { id: "Frontend", label: "Frontend" },
    { id: "Backend", label: "Backend" },
] as const;

interface MultiSelectProps {
    value?: string[];
    onChange?: (selected: string[]) => void;
    defaultSelected?: string[];
}

export default function MultiSelect({ value, onChange, defaultSelected = [] }: MultiSelectProps) {
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
