import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Examples } from "@/components/sections/examples";

export default async function Home() {
    return (
        <main className="flex flex-col items-center min-h-[calc(100svh-4.5rem)] gap-4">
            <div className="container">
                <Hero />
                <Features />
                <Examples />
            </div>
        </main>
    )
}
