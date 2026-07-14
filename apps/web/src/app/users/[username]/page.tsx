import UserProfile from "@/components/sections/user-profile";
import UserSnippet from "@/components/sections/user-snippet";
import { connectDB, User } from "@codesnip/db";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

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
            <section className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-6xl p-4">
                <UserProfile userId={userId} />
                <Separator className="block md:hidden my-4"/>
                <UserSnippet userId={userId} />
            </section>
        </main>
    );
}