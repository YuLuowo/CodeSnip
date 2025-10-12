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
import {LogOut, User} from "lucide-react";
import {redirect} from "next/navigation";

export default function UserMenu() {
    const { data: session } = useSession();

    function logout() {
        signOut({callbackUrl: "/"}).then(redirect("/"));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none">
                    <Avatar className="w-9 h-9">
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
                <DropdownMenuItem onClick={() => console.log()}>
                    <User />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
