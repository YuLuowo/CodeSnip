import { connectDB } from "@/lib/mongodb";
import Snippet from "@/models/Snippet";
import {redirect} from "next/navigation";
import { Types } from "mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import SnippetView from "@/components/sections/snippet";

interface SnippetPageProps {
    params: { id: string };
}

export default async function SnippetPage({ params }: SnippetPageProps) {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
        if (!session) redirect("/login");
        redirect("/snippets");
    }

    const snippet = await Snippet.findById(id).populate("author", "name image");
    if (!snippet) {
        if (!session) redirect("/login");
        redirect("/snippets");
    }

    if (!snippet.isPublic && snippet.author.id.toString() !== session?.user?.id) {
        redirect("/snippets");
    }

    return (
        <main className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center gap-6">
            <SnippetView snippet={JSON.parse(JSON.stringify(snippet))} />
        </main>
    )
}