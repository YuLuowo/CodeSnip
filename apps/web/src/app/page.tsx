import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Examples } from "@/components/sections/examples";
import { BotSpotlight } from "@/components/sections/bot-spotlight";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { Dashboard } from "@/components/sections/dashboard";
import { Separator } from "@/components/ui/separator";

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
        <main className="flex flex-col items-center w-full -mt-16">
            <Hero />
            <Features />
            <Examples />
            <Separator />
            <BotSpotlight />
            <HowItWorks />
            <Separator />
            <FinalCta />
        </main>
    )
}
