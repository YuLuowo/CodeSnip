"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "use-intl";
import { FolderCode, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowingResponse, FollowingUser, SnippetsResponse } from "@/configs/types";

export function DashboardStats() {
    const { data: session } = useSession();
    const [snippetsCount, setSnippetsCount] = useState(0);
    const [following, setFollowing] = useState<FollowingUser[]>([]);
    const [loading, setLoading] = useState(true);

    const t = useTranslations("Dashboard.stats");

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchStats = async () => {
            setLoading(true);

            try {
                const [snippetsRes, followingRes] = await Promise.all([
                    fetch(`/api/snippets?scope=me`),
                    fetch(`/api/users/${session.user.id}/following?limit=3`),
                ]);

                if (snippetsRes.ok) {
                    const data: SnippetsResponse = await snippetsRes.json();
                    setSnippetsCount(data.pagination.total);
                }

                if (followingRes.ok) {
                    const data: FollowingResponse = await followingRes.json();
                    setFollowing(data.following);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session?.user?.id]);

    return (
        <Card className="gap-3">
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <FolderCode className="size-4 text-muted-foreground" />
                    <span className="text-sm">{t("snippets_count")}</span>
                    <span className="ml-auto text-sm font-semibold">
                        {loading ? <Skeleton className="h-4 w-6" /> : snippetsCount}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="text-sm">{t("following")}</span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col gap-2 pl-6">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Skeleton className="size-6 rounded-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : following.length === 0 ? (
                        <p className="pl-6 text-xs text-muted-foreground">{t("no_following")}</p>
                    ) : (
                        <div className="flex flex-col gap-2 pl-6">
                            {following.map((user) => (
                                <Link
                                    key={user._id}
                                    href={`/users/${user.username}`}
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <Avatar size="sm">
                                        <AvatarImage src={user.image ?? undefined} alt={user.name} />
                                        <AvatarFallback>
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm truncate">{user.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
