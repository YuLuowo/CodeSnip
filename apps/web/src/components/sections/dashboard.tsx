"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DashboardQuickLinks } from "@/components/sections/dashboard-quick-links";
import { FollowingFeed } from "@/components/sections/following-feed";
import { MySnippetsMini } from "@/components/sections/my-snippets-mini";
import { DashboardStats } from "@/components/sections/dashboard-stats";

export function Dashboard() {
    const { data: session } = useSession();
    const t = useTranslations("Dashboard");

    return (
        <div className="flex flex-col gap-6 py-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar size="lg">
                        <AvatarImage
                            src={session?.user?.image ?? undefined}
                            alt={session?.user?.name ?? ""}
                        />
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{t("welcome")}</span>
                        <span className="text-xl font-semibold">{session?.user?.name}</span>
                    </div>
                </div>

                <Link href="/snippets/create">
                    <Button className="cursor-pointer">
                        <Plus />
                        {t("create")}
                    </Button>
                </Link>
            </div>

            <DashboardQuickLinks />

            <Separator />

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-72 flex flex-col gap-4 shrink-0">
                    <MySnippetsMini />
                    <DashboardStats />
                </div>

                <div className="flex-1 min-w-0 w-full">
                    <FollowingFeed />
                </div>
            </div>
        </div>
    )
}
