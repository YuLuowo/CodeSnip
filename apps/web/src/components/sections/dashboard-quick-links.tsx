"use client";

import Link from "next/link";
import { useTranslations } from "use-intl";
import { FolderCode, Heart, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardQuickLinks() {
    const t = useTranslations("Dashboard.quick_links");

    const links = [
        {
            href: "/snippets",
            icon: FolderCode,
            title: t("my_snippets.title"),
            desc: t("my_snippets.desc"),
        },
        {
            href: "/favorites",
            icon: Heart,
            title: t("favorites.title"),
            desc: t("favorites.desc"),
        },
        {
            href: "/assistant",
            icon: Sparkles,
            title: t("assistant.title"),
            desc: t("assistant.desc"),
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
                {t("title")}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {links.map(({ href, icon: Icon, title, desc }) => (
                    <Link href={href} key={href}>
                        <Card className="p-0 gap-0 transition-colors cursor-pointer">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex items-center justify-center size-10 rounded-lg bg-accent shrink-0">
                                    <Icon className="size-5" />
                                </div>
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <span className="font-semibold text-sm">{title}</span>
                                    <span className="text-xs text-muted-foreground truncate">{desc}</span>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
