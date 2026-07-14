"use client"

import { useEffect } from "react"

type ShortcutHandler = () => void

interface ShortcutOptions {
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
    alt?: boolean
}

export function useKeyboardShortcut(
    key: string,
    handler: ShortcutHandler,
    options?: ShortcutOptions
) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement).tagName;

            if (tag === "INPUT" || tag === "TEXTAREA") return;

            if (e.key.toLowerCase() !== key.toLowerCase()) return;

            if (options?.ctrl && !e.ctrlKey) return;
            if (options?.meta && !e.metaKey) return;
            if (options?.shift && !e.shiftKey) return;
            if (options?.alt && !e.altKey) return;

            handler();
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [key, handler, options]);
}