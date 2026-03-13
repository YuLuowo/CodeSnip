"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {signOut, useSession} from "next-auth/react";
import { Code, LogOut } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import * as React from "react";

export default function UserMenu() {
    const { data: session } = useSession();
    const router = useRouter();
    const t = useTranslations("Navbar.avatar");

    function logout() {
        signOut({callbackUrl: "/"}).then(redirect("/"));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                    <div className="flex flex-row items-center gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        {session?.user?.name}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/snippets")}>
                    <Code/>
                    <span>{t("my_snippet")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    <span>{t("sign_out")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
