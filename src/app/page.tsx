import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-3xl font-bold">👋 Test</h1>
            <ThemeToggle />
        </main>
    )
}
