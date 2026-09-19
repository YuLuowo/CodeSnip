import { Suspense } from "react";
import ProfileSetting from "@/components/sections/profile-setting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return (
        <main className="flex items-center justify-center">
            <Suspense fallback={null}>
                <ProfileSetting />
            </Suspense>
        </main>
    );
}