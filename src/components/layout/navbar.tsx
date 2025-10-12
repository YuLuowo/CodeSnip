"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
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
import {redirect} from "next/navigation";

export function Navbar() {
    const [open, setOpen] = useState(false);

    const { data: session } = useSession();
    const isSignedIn = !!session?.user;

    function logout() {
        signOut({callbackUrl: "/"}).then(redirect("/"));
    }

    return (
        <nav className="w-full bg-background sticky top-0 z-50">
            <div className="container max-w-4xl mx-auto flex items-center justify-between p-4 md:px-8">
                <Link href="/" className="text-xl font-bold">
                    Code Snippet
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[300px] gap-4">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    <div className="font-medium">Trending Snippets</div>
                                                    <div className="text-muted-foreground">
                                                        ABC
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    <div className="font-medium">Newest Snippets</div>
                                                    <div className="text-muted-foreground">
                                                        ABC
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    <div className="font-medium">Categories</div>
                                                    <div className="text-muted-foreground">
                                                        ABC
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={isSignedIn ? "/snippets" : "/login"}>Snippets</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/">Docs</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center justify-between gap-4">
                        <ThemeToggle />
                        {session?.user?.image ? (
                            <UserMenu />
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="outline"><span>Sign in</span></Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle/>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-[250px] sm:w-[280px] px-4">
                            <VisuallyHidden>
                                <SheetTitle>Code Snippet</SheetTitle>
                                <SheetDescription>Hi</SheetDescription>
                            </VisuallyHidden>

                            <div className="mt-10 flex flex-col pt-3 pb-6 space-y-3 text-lg">
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">Home</span>
                                </Link>
                                <div>
                                    <div className="mb-2">
                                        <span className="font-semibold">Explore</span>
                                    </div>
                                    <div className="flex flex-col space-y-2 pl-2 text-base">
                                        <Link href="#" onClick={() => setOpen(false)}>Trending Snippets</Link>
                                        <Link href="#" onClick={() => setOpen(false)}>Newest Snippets</Link>
                                        <Link href="#" onClick={() => setOpen(false)}>Categories</Link>
                                    </div>
                                </div>
                                <Link href={isSignedIn ? "/snippets" : "/login"} onClick={() => setOpen(false)}>
                                    <span className="font-semibold">Snippets</span>
                                </Link>
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <span className="font-semibold">Docs</span>
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
                                        <span>Sign out</span>
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login" passHref>
                                    <Button variant="outline"><span>Sign in</span></Button>
                                </Link>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>

    )
}
