"use client"

import { useTheme } from "next-themes"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"

export function KeyboardShortcutsProvider() {
    const { theme, setTheme } = useTheme();

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    useKeyboardShortcut("d", toggleTheme);

    return null;
}