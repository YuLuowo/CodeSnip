import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HeroBackGround } from "@/components/sections/hero-background";

export async function Hero() {
    const t = await getTranslations("Home");

    return (
        <section className="relative flex min-h-screen w-full items-center overflow-hidden px-10 md:px-20">
            <HeroBackGround />
            <div className="relative z-20 grid w-full max-w-7xl mx-auto grid-cols-1 items-center gap-8 py-12 md:grid-cols-2 md:gap-10 md:py-0">
                <div className="flex flex-col items-start gap-4 text-left">
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-muted-foreground">
                        {t("badge")}
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t("title")}</h1>
                    <span className="text-sm md:text-base max-w-xl text-muted-foreground">
                        {t("desc")}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                        <Link href="/snippets/create">
                            <Button variant="default" size="sm" className="hover:cursor-pointer">
                                {t("get_start")}
                            </Button>
                        </Link>
                        <Link href="/snippets">
                            <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                                {t("view")}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="w-full">
                    <div className="relative rounded-lg md:rounded-xl border bg-card p-1.5 md:p-2 shadow-2xl ">
                        <img
                            src="/images/light/showcase.png"
                            alt="Snippet manager preview"
                            draggable={false}
                            className="relative w-full rounded-md md:rounded-lg select-none dark:hidden"
                        />

                        <img
                            src="/images/dark/showcase.png"
                            alt="Snippet manager preview"
                            draggable={false}
                            className="relative hidden w-full rounded-md md:rounded-lg select-none dark:block"
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}
