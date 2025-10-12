import { connectDB } from "@/lib/mongodb";
import Snippet from "@/models/Snippet";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import EditSnippet from "@/components/sections/edit-snippet";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface EditPageProps {
    params: { id: string };
}

export default async function EditPage({ params }: EditPageProps) {
    await connectDB();
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    if (!Types.ObjectId.isValid(id)) redirect("/snippets");

    const snippet = await Snippet.findById(id).populate("author", "_id name image");
    if (!snippet) redirect("/snippets");

    const authorId = snippet.author?.id.toString();
    const userId = session.user.id;

    if (authorId !== userId) {
        redirect("/snippets");
    }

    return (
        <main className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center gap-6">
            <div className="w-full max-w-3xl px-4 py-6">
                <EditSnippet snippet={JSON.parse(JSON.stringify(snippet))} />
            </div>
        </main>
    );
}
