"use client"

import { useTheme } from "next-themes"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"
import { useSearchCommand } from "@/components/providers/search-command-provider"

export function KeyboardShortcutsProvider() {
    const { theme, setTheme } = useTheme();
    const { setOpen } = useSearchCommand();

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    function openSearchCommand() {
        setOpen(true);
    }

    useKeyboardShortcut("d", toggleTheme);
    useKeyboardShortcut("/", openSearchCommand);

    return null;
}