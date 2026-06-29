"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserProfileResponse } from "@/configs/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FollowGroup from "@/components/custom/follow-group";
import { useEffect, useState } from "react";
import { Github, Globe, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserProfileProps {
    userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfileResponse>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/users/${userId}/profile`);
                if (!res.ok) {
                    throw new Error("Failed to fetch settings");
                }
                const data: UserProfileResponse = await res.json();
                setProfile(data);
                console.log(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, [userId]);

    if (loading || !profile) {
        return;
    }

    return (
        <section className="flex-1 min-w-0 min-h-screen p-4">
            <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center">
                    <Avatar className="w-full h-full">
                        <AvatarImage src={profile.user.image} alt={profile.user.name} />
                    </Avatar>
                </div>

                <div className="flex flex-col">
                    <span className="text-2xl font-semibold">{profile.user.name}</span>
                    <span className="text-lg text-muted-foreground">@{profile.user.username}</span>
                </div>

                <span className="min-w-0 wrap-break-word">
                    Hi
                </span>

                {session?.user?.id === profile.user._id ? (
                    <div className="flex flex-col justify-center gap-4">
                        <Link href="/setting">
                            <Button variant="outline" size="sm" className="cursor-pointer w-full">
                                Edit profile
                            </Button>
                        </Link>
                        <div className="flex gap-2 items-center text-sm">
                            <Users size={16} />
                            <div>{profile.followStats.followersCount}<span className="text-muted-foreground"> 位粉絲</span></div>
                            <div>{profile.followStats.followingCount}<span className="text-muted-foreground"> 追蹤中</span></div>
                        </div>
                    </div>
                ) : (
                    <FollowGroup
                        userId={profile.user._id}
                        initialIsFollowing={profile.followStats.isFollowing}
                        initialFollowersCount={profile.followStats.followersCount}
                        initialFollowingCount={profile.followStats.followingCount}
                    />
                )}

                <Separator orientation="horizontal" />

                <div className="flex items-center gap-2">
                    <Globe size={16} />
                    {profile.profile.website ? (
                        <Link href={profile.profile.website} className="text-blue-500 hover:underline">
                            <span className="text-sm">{profile.profile.website}</span>
                        </Link>
                    ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                    )}
                </div>

                {/** TODO: Connect Github Account */}
                <div className="flex items-center gap-2">
                    <Github size={16} />
                    {profile.profile.githubUrl ? (
                        <Link href={profile.profile.githubUrl} className="text-blue-500 hover:underline">
                            <span className="text-sm">{profile.profile.githubUrl}</span>
                        </Link>
                    ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                    )}
                </div>

            </div>
        </section>
    );
}