import CreateSnippet from "@/components/sections/create-snippet";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function Create() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return (
        <main className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center gap-6">
            <div className="w-full max-w-3xl px-4 py-6">
                <CreateSnippet />
            </div>
        </main>
    )
}