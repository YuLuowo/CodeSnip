"use client"

import * as React from "react"
import Link from "next/link"
import { Code, Heart, LogOut, Menu, Plus } from "lucide-react"
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
import { signOut, useSession } from "next-auth/react";
import UserMenu from "@/components/custom/user/user-menu";
import { redirect } from "next/navigation";
import { SearchCommand } from "@/components/custom/search/search-command";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "use-intl";
import { LanguageSwitcher } from "@/components/custom/common/language-switcher";

export function AppNavbar() {
    const [open, setOpen] = useState(false);

    const {data: session} = useSession();
    const isSignedIn = !!session?.user;

    function logout() {
        signOut({callbackUrl: "/"}).then(redirect("/"));
    }

    const t = useTranslations("Navbar");
    const tAvatar = useTranslations("Navbar.avatar");
    const tExplore = useTranslations("Navbar.explore");
    return (
        <nav className="w-full bg-accent/50 shadow-xs backdrop-blur backdrop-saturate-100 fixed top-0 z-50 border-b">
            <div className="container mx-auto flex items-center justify-between py-4">
                <div className="w-full hidden md:flex items-center justify-between gap-6">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/" className="text text-foreground flex flex-row gap-4 items-center justify-center">
                                        <Code/>
                                        {t("dashboard")}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={isSignedIn ? "/snippets" : "/login"} className="text text-foreground">{t("snippets")}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger><span className="text text-foreground">{tExplore("title")}</span></NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex w-[500px]">
                                        <ul className="flex-1 space-y-2 p-2">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/search?page=1&sort=popular" className="flex flex-col gap-0.5 rounded-md p-2 hover:bg-accent">
                                                        <span className="text-sm font-medium">{tExplore("trending.title")}</span>
                                                        <span className="text-xs text-muted-foreground">{tExplore("trending.desc")}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/search?page=1&sort=latest" className="flex flex-col gap-0.5 rounded-md p-2 hover:bg-accent">
                                                        <span className="text-sm font-medium">{tExplore("newest.title")}</span>
                                                        <span className="text-xs text-muted-foreground">{tExplore("newest.desc")}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/categories" className="flex flex-col gap-0.5 rounded-md p-2 hover:bg-accent">
                                                        <span className="text-sm font-medium">{tExplore("categories.title")}</span>
                                                        <span className="text-xs text-muted-foreground">{tExplore("categories.desc")}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                        <div className="mx-4 border-l border-border" />
                                        <ul className="flex-1 space-y-2 p-2">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/ai-resources" className="flex flex-col gap-0.5 rounded-md p-2 hover:bg-accent">
                                                        <span className="text-sm font-medium">{tExplore("ai_resources.title")}</span>
                                                        <span className="text-xs text-muted-foreground">{tExplore("ai_resources.desc")}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/assistant" className="flex flex-col gap-0.5 rounded-md p-2 hover:bg-accent">
                                                        <span className="text-sm font-medium">{tExplore("ai_resource_assistant.title")}</span>
                                                        <span className="text-xs text-muted-foreground">{tExplore("ai_resource_assistant.desc")}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex h-5 items-center justify-between gap-2">
                        <SearchCommand/>
                        <Separator orientation="vertical"/>
                        <Link href="/snippets/create" passHref>
                            <Button variant="outline" size="sm" className="text-sm h-8 cursor-pointer"><Plus className="w-4 h-4"/> {t("create_snippet")}</Button>
                        </Link>
                        <Separator orientation="vertical"/>
                        <ThemeToggle/>
                        <Separator orientation="vertical"/>
                        <LanguageSwitcher/>
                        <Separator orientation="vertical"/>
                        {session?.user?.image ? (
                            <UserMenu/>
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="outline" className="text-sm h-8">{t("avatar.sign_in")}</Button>
                            </Link>
                        )}
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
                                <Link href={isSignedIn ? "/snippets" : "/login"} onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("snippets")}</span>
                                </Link>
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("docs")}</span>
                                </Link>
                            </div>
                            {isSignedIn ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name ?? "User"}
                                            className="h-8 w-8 rounded-full object-cover border"
                                        />
                                        <span className="font-semibold">{session.user.name}</span>
                                    </div>
                                    <Separator orientation="horizontal"/>
                                    <div className="flex flex-col gap-4 pt-1 pb-4 font-semibold">
                                        <Link href={`/users/${session?.user?.username}`} onClick={() => setOpen(false)}>
                                            <span>{tAvatar("profile")}</span>
                                        </Link>
                                        <Link href="/snippets" onClick={() => setOpen(false)}>
                                            <span>{tAvatar("my_snippet")}</span>
                                        </Link>
                                        <Link href="/favorites" onClick={() => setOpen(false)}>
                                            <span>{tAvatar("my_favorite")}</span>
                                        </Link>
                                        <Link href="/settings" onClick={() => setOpen(false)}>
                                            <span>{tAvatar("setting")}</span>
                                        </Link>
                                    </div>

                                    <Button variant="destructive" onClick={logout}>
                                        <span>{t("avatar.sign_out")}</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <Separator orientation="horizontal"/>
                                    <div className="flex flex-col gap-2 pt-4">
                                        <Link href="/login" onClick={() => setOpen(false)} passHref>
                                            <span className="font-semibold">{t("avatar.sign_in")}</span>
                                        </Link>
                                    </div>

                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                    <ThemeToggle/>
                    <LanguageSwitcher/>
                </div>
            </div>
        </nav>

    )
}