"use client"

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/components/theme-provider";

export function ThemeToggle() {
    const {darkMode, setDarkMode} = useDarkMode();

    return (
        <Button
            variant="outline"
            onClick={() => setDarkMode(!darkMode)}
        >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    )
}
