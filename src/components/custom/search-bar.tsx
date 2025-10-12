"use client";

import { SearchIcon } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";

interface SearchBarProps {
    value?: string;
    onChange?: (title: string) => void;
}

export function SearchBar({ value = "", onChange }: SearchBarProps) {
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        setTitle(value);
    }, [value]);

    useEffect(() => {
        if (onChange) {
            onChange(title);
        }
    }, [title, onChange]);

    return (
        <div className="grid w-full max-w-sm gap-6">
            <InputGroup>
                <InputGroupInput
                    placeholder="Find a snippet..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}
