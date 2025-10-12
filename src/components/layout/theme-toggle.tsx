"use client"

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/components/providers/theme-provider";

export function ThemeToggle() {
    const {darkMode, setDarkMode} = useDarkMode();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="hover:cursor-pointer"
        >
            {darkMode ? <Sun /> : <Moon />}
        </Button>
    )
}
