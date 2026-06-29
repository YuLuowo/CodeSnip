import UserProfile from "@/components/sections/user-profile";
import UserSnippet from "@/components/sections/user-snippet";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";

interface UserPageProps {
    params: { username: string };
}

export default async function UserPage({ params }: UserPageProps) {
    await connectDB();
    const { username } = await params;

    const user = await User.findOne({
        username,
    });

    if (!user) {
        notFound();
    }

    const userId = user._id.toString();


    return (
        <main className="flex items-center justify-center">
            <section className="flex justify-center gap-4 w-full max-w-6xl p-4">
                <UserProfile userId={userId} />
                <UserSnippet userId={userId} />
            </section>
        </main>
    );
}