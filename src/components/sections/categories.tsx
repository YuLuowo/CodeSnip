"use client"

import { Separator } from "@/components/ui/separator";
import { useTranslations } from "use-intl";
import { Flame, SquareChartGantt } from "lucide-react";
import Link from "next/link";

interface Categories {
    _id: string;
    count: number;
}

interface CategoryProps {
    categories: Categories[];
}

export default function Categories({ categories }: CategoryProps) {
    const t = useTranslations("Category");
    const tTags = useTranslations("SnippetTags.tags");

    return (
        <section className="flex flex-col gap-4 w-full max-w-4xl">
            <div className="flex flex-col gap-2 justify-center">
                <h2 className="text-4xl font-semibold">{t("title")}</h2>
                <span className="text-muted-foreground">{t("desc")}</span>
            </div>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-3 gap-4">
                {categories.map((category, index) => (
                    <Link key={category._id} href={`/search?tag=${category._id}`} className="flex items-center p-4 gap-4 border border-muted rounded-lg shadow-sm hover:shadow-md hover:bg-muted/40 transition-shadow duration-300 cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-sm">
                            { index < 3 ? <Flame className="h-6 w-6 text-red-500" /> : <SquareChartGantt className="h-6 w-6 text-accent-foreground" /> }
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-medium">{tTags(category._id)}</span>
                            <span className="text-sm text-muted-foreground">{category.count} {category.count > 1 ? t("snippets") : t("snippet")}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}