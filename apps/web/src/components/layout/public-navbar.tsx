"use client"

import * as React from "react"
import Link from "next/link"
import { Code, Menu } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchCommand } from "@/components/custom/search/search-command";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "use-intl";
import { LanguageSwitcher } from "@/components/custom/common/language-switcher";

export function PublicNavbar() {
    const [open, setOpen] = useState(false);

    const t = useTranslations("Navbar");
    const tExplore = useTranslations("Navbar.explore");
    return (
        <header className="fixed top-4 inset-x-0 z-50 mx-3 md:mx-auto max-w-5xl px-4 border-0 border-accent/80 rounded-xl bg-accent/30 shadow-xs backdrop-blur backdrop-saturate-100 transition-colors">
            <div className="container flex justify-between items-center h-full px-4 py-4">
                <div className="hidden md:flex justify-between items-center gap-4 w-full">
                    <div>
                        <Link href="/" className="text-lg font-semibold">
                            CodeSnip
                        </Link>
                    </div>
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/" className="text-sm">{t("home")}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm">{tExplore("title")}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex w-[500px]">
                                        <ul className="flex-1 space-y-2">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/search?page=1&sort=popular">
                                                        <div className="font-medium">{tExplore("trending.title")}</div>
                                                        <div className="text-muted-foreground">
                                                            {tExplore("trending.desc")}
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/search?page=1&sort=latest">
                                                        <div className="font-medium">{tExplore("newest.title")}</div>
                                                        <div className="text-muted-foreground">
                                                            {tExplore("newest.desc")}
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/categories">
                                                        <div className="font-medium">{tExplore("categories.title")}</div>
                                                        <div className="text-muted-foreground">
                                                            {tExplore("categories.desc")}
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                        <div className="mx-4 border-l border-border" />
                                        <ul className="flex-1 space-y-2">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/ai-resources">
                                                        <div className="font-medium">{tExplore("ai_resources.title")}</div>
                                                        <div className="text-muted-foreground">
                                                            {tExplore("ai_resources.desc")}
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/assistant">
                                                        <div className="font-medium">{tExplore("ai_resource_assistant.title")}</div>
                                                        <div className="text-muted-foreground">
                                                            {tExplore("ai_resource_assistant.desc")}
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/" className="text-sm">{t("docs")}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex h-5 items-center justify-between gap-4">
                        <ThemeToggle/>
                        <Separator orientation="vertical"/>
                        <LanguageSwitcher/>
                        <Separator orientation="vertical"/>
                        <Link href="/login" passHref>
                            <Button variant="outline" className="text-sm h-8">{t("avatar.sign_in")}</Button>
                        </Link>
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="w-5 h-5"/>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-[250px] sm:w-[280px] px-4">
                            <VisuallyHidden>
                                <SheetTitle>Code Snippet</SheetTitle>
                                <SheetDescription>{t("title")}</SheetDescription>
                            </VisuallyHidden>

                            <div className="mt-10 flex flex-col pt-3 pb-6 space-y-3 text-lg">
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("home")}</span>
                                </Link>
                                <div>
                                    <div className="mb-2">
                                        <span className="font-semibold">{tExplore("title")}</span>
                                    </div>
                                    <div className="flex flex-col space-y-2 pl-2 text-base">
                                        <Link href="/search?page=1&sort=popular" onClick={() => setOpen(false)}>{tExplore("trending.title")}</Link>
                                        <Link href="/search?page=1&sort=latest" onClick={() => setOpen(false)}>{tExplore("newest.title")}</Link>
                                        <Link href="/categories" onClick={() => setOpen(false)}>{tExplore("categories.title")}</Link>
                                        <Link href="/ai-resources" onClick={() => setOpen(false)}>{tExplore("ai_resources.title")}</Link>
                                        <Link href="/assistant" onClick={() => setOpen(false)}>{tExplore("ai_resource_assistant.title")}</Link>
                                    </div>
                                </div>
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("snippets")}</span>
                                </Link>
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("docs")}</span>
                                </Link>
                            </div>
                            <div className="flex flex-col">
                                <Separator orientation="horizontal"/>
                                <div className="flex flex-col gap-2 pt-4">
                                    <Link href="/login" onClick={() => setOpen(false)} passHref>
                                        <span className="font-semibold">{t("avatar.sign_in")}</span>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <ThemeToggle/>
                    <LanguageSwitcher/>
                </div>
            </div>
        </header>
    )
}
