import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Examples } from "@/components/sections/examples";
import { Dashboard } from "@/components/sections/dashboard";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        return (
            <main className="flex flex-col items-center min-h-[calc(100svh-4.5rem)] gap-4">
                <div className="container">
                    <Dashboard />
                </div>
            </main>
        )
    }

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
