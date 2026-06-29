"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

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
                        ? "Loading..."
                        : following
                            ? "Following"
                            : "Follow"
                }
            </Button>
            <div className="flex gap-2 items-center text-sm">
                <Users size={16} />
                <div>{followersCount}<span className="text-muted-foreground"> 位粉絲</span></div>
                <div>{followingCount}<span className="text-muted-foreground"> 追蹤中</span></div>
            </div>
            {/*<Button variant="outline" size="sm" className="cursor-pointer w-full" onClick={handleFollow} disabled={loading}>*/}
            {/*    {*/}
            {/*        loading*/}
            {/*            ? "Loading..."*/}
            {/*            : following*/}
            {/*                ? "Following"*/}
            {/*                : "Follow"*/}
            {/*    }*/}
            {/*</Button>*/}
            {/*<div className="flex justify-center items-center gap-8">*/}
            {/*    <div className="flex flex-col items-center gap-1">*/}
            {/*        <span className="text-xl font-semibold">{followersCount}</span>*/}
            {/*        <span className="text-sm text-muted-foreground">粉絲</span>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-col items-center gap-1">*/}
            {/*        <span className="text-xl font-semibold">{followingCount}</span>*/}
            {/*        <span className="text-sm text-muted-foreground">追蹤中</span>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>

    );
}