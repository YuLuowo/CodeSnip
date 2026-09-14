"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
    const router = useRouter();

    const [locale, setLocale] = useState("en");

    useEffect(() => {
        const match = document.cookie.match(/locale=([^;]+)/);
        if (match) setLocale(match[1]);
    }, [])

    function changeLocale(value: string) {
        setLocale(value);

        document.cookie = `locale=${value};path=/;max-age=31536000`;
        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle language"
                    className="w-8 h-8"
                >
                    <Languages />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-32">
                <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
                    <DropdownMenuRadioItem value="en"> English </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="zh-TW"> 繁體中文 </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}