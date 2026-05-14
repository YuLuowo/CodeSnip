import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FavoriteSnippet from "@/components/sections/favorite-snippet";

export default async function Favorites() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return (
        <main className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center gap-6">
            <div className="w-full max-w-5xl">
                <FavoriteSnippet />
            </div>
        </main>
    )
}