import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Providers from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { KeyboardShortcutsProvider } from "@/components/providers/keyboard-shortcuts-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
    title: "Code Snippet",
    description: "A modern code snippet manager that helps developers save time, stay organized, and collaborate effortlessly.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const messages = await getMessages();

    return (
        <html lang="en" suppressHydrationWarning>
        <body>
            <NextIntlClientProvider messages={messages}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        <KeyboardShortcutsProvider />
                        <Navbar />
                        {children}
                        <Toaster richColors position="top-right" />
                        <Footer />
                    </Providers>
                </ThemeProvider>
            </NextIntlClientProvider>
        </body>
        </html>
    );
}
