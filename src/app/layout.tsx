import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Providers from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "Code Snippet",
    description: "A modern code snippet manager that helps developers save time, stay organized, and collaborate effortlessly.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
            <ThemeProvider>
                <Providers>
                    <Navbar />
                    {children}
                    <Toaster richColors position="top-right" />
                    <Footer />
                </Providers>
            </ThemeProvider>
        </body>
        </html>
    );
}
