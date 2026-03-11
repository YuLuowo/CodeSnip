"use client"

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Half2Icon } from "@radix-ui/react-icons";
import { Kbd } from "@/components/ui/kbd";
import { useTranslations } from "use-intl";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("Navbar");

    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) return null;

    return (
        <Tooltip key="bottom">
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label={t("theme")}
                    className="w-8 h-8"
                >
                    {theme === "dark" ? (
                        <Half2Icon className="h-5 w-5" />
                    ) : (
                        <Half2Icon className="h-5 w-5" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex items-center gap-2">
                <span>{t("theme")}</span>
                <Kbd>D</Kbd>
            </TooltipContent>
        </Tooltip>

    )
}
