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
import { signOut, useSession } from "next-auth/react";
import UserMenu from "@/components/custom/user-menu";
import { redirect } from "next/navigation";
import { SearchCommand } from "@/components/custom/search-command";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "use-intl";
import { LanguageSwitcher } from "@/components/custom/language-switcher";

export function Navbar() {
    const [open, setOpen] = useState(false);

    const {data: session} = useSession();
    const isSignedIn = !!session?.user;

    function logout() {
        signOut({callbackUrl: "/"}).then(redirect("/"));
    }

    const t = useTranslations("Navbar");
    const tExplore = useTranslations("Navbar.explore");
    return (
        <nav className="w-full bg-background sticky top-0 z-50">
            <div className="container max-w-6xl mx-auto flex items-center justify-between p-4">
                <div className="w-full hidden md:flex items-center justify-between gap-6">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <Link href="/">
                                <Button variant="ghost" className="h-8">
                                    <Code/>
                                </Button>
                            </Link>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/" className="text-sm">{t("home")}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm">{tExplore("title")}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[300px] gap-4">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    <div className="font-medium">{tExplore("trending.title")}</div>
                                                    <div className="text-muted-foreground">
                                                        {tExplore("trending.desc")}
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    <div className="font-medium">{tExplore("newest.title")}</div>
                                                    <div className="text-muted-foreground">
                                                        {tExplore("newest.desc")}
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    <div className="font-medium">{tExplore("categories.title")}</div>
                                                    <div className="text-muted-foreground">
                                                        {tExplore("categories.desc")}
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={isSignedIn ? "/snippets" : "/login"} className="text-sm">{t("snippets")}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/" className="text-sm">{t("docs")}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex h-5 items-center justify-between gap-4">
                        <SearchCommand/>
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
                                        <Link href="#" onClick={() => setOpen(false)}>{tExplore("trending.title")}</Link>
                                        <Link href="#" onClick={() => setOpen(false)}>{tExplore("newest.title")}</Link>
                                        <Link href="#" onClick={() => setOpen(false)}>{tExplore("categories.title")}</Link>
                                    </div>
                                </div>
                                <Link href={isSignedIn ? "/snippets" : "/login"} onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("snippets")}</span>
                                </Link>
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">{t("docs")}</span>
                                </Link>
                            </div>
                            {session?.user?.image ? (
                                <div className="flex flex-col space-y-4">
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name ?? "User"}
                                        className="h-10 w-10 rounded-full object-cover border"
                                    />
                                    <Button variant="outline" onClick={logout}>
                                        <span>{t("avatar.sign_out")}</span>
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login" passHref>
                                    <Button variant="outline"><span>{t("avatar.sign_in")}</span></Button>
                                </Link>
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
