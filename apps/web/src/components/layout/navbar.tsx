"use client"

import { useSession } from "next-auth/react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { AppNavbar } from "@/components/layout/app-navbar";

export function Navbar() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <nav className="w-full bg-background sticky top-0 z-50 h-[65px]" />;
    }

    return session?.user ? <AppNavbar/> : <PublicNavbar/>;
}
