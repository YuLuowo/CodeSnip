import {Button} from "@/components/ui/button";
import {SearchBar} from "@/components/custom/search-bar";
import Link from "next/link";

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 px-6 md:px-20 py-8 md:py-16">
            <h1 className="text-3xl md:text-5xl font-bold">Share What You Build.</h1>
            <span className="text-sm md:text-xl max-w-2xl text-center mb-2">
                        A modern code snippet manager that helps developers save time, stay organized, and collaborate effortlessly.
                    </span>
            { /*<SearchBar />*/ }
            <div className="flex items-center justify-center gap-2">
                <Link href="/create">
                    <Button variant="default" size="sm" className="hover:cursor-pointer">
                        Get Started
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                    View Snippets
                </Button>
            </div>

            <div className="mt-18 max-w-6xl w-full">
                <div className="relative animate-rotate-border transition-all duration-500 ease-out transform-3d rounded-lg md:rounded-xl bg-conic/[from_var(--border-angle)] from-transparent dark:from-black via-pink-400 dark:via-white to-blue-300 dark:to-black from-80% via-90% to-100% p-0.5 md:p-1">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 dark:from-blue-300 to-purple-400 dark:to-purple-300 rounded md:rounded-lg blur md:blur-lg opacity-75"></div>
                    <div className="absolute inset-0 z-10 bg-transparent"></div>
                    <img
                        src="/images/snippet-preview.png"
                        alt="Snippet manager preview"
                        className="relative rounded-lg md:rounded-xl shadow-lg"
                    />
                </div>
            </div>
        </section>
    )
}