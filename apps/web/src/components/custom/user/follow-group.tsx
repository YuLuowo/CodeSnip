"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useTranslations } from "use-intl";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing: boolean;
    initialFollowersCount: number;
    initialFollowingCount: number;
}

export default function FollowGroup({ userId, initialIsFollowing, initialFollowersCount, initialFollowingCount }: FollowButtonProps) {
    const [following, setFollowing] = useState(initialIsFollowing);
    const [followersCount, setFollowersCount] = useState(initialFollowersCount);
    const [followingCount, setFollowingCount] = useState(initialFollowingCount);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const t = useTranslations("Profile");

    async function handleFollow() {
        if (!session) {
            router.push("/login");
            return;
        }

        const nextState = !following;
        setFollowing(nextState);
        setFollowersCount((prev) =>
            nextState ? prev + 1 : prev - 1
        );

        try {
            setLoading(true);
            const res = await fetch(
                `/api/users/${userId}/follow`,
                {
                    method:"POST"
                }
            );

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            setFollowing(data.following);
        } catch(err) {
            console.error(err);

            setFollowing((prev) => !prev);

            setFollowersCount((prev) =>
                following ? prev + 1 : prev - 1
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center gap-4">
            <Button variant="outline" size="sm" className="cursor-pointer w-full" onClick={handleFollow} disabled={loading}>
                {
                    loading
                        ? t("follow_loading")
                        : following
                            ? t("following_text")
                            : t("follow_text")
                }
            </Button>
            <div className="flex gap-2 items-center text-sm">
                <Users size={16} />
                <div>{followersCount}<span className="text-muted-foreground"> {t("follower")}</span></div>
                <div>{followingCount}<span className="text-muted-foreground"> {t("following")}</span></div>
            </div>
        </div>

    );
}