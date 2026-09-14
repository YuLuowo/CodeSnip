"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { SearchCommandProvider } from "@/components/providers/search-command-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SearchCommandProvider>
                {children}
            </SearchCommandProvider>
        </SessionProvider>
    );
}
