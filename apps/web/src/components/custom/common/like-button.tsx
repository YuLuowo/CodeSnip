"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartPlus } from "lucide-react";
import {useRouter} from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "use-intl";

interface LikeButtonProps {
    snippetId: string;
    initialLikes: string[];
    userId?: string;
    showFavoriteCount: boolean;
}

export default function LikeButton({
                                       snippetId,
                                       initialLikes,
                                       userId,
                                       showFavoriteCount,
                                   }: LikeButtonProps) {
    const [likes, setLikes] = useState<string[]>(initialLikes);
    const router = useRouter();
    const isLiked = likes.some((id) => id === userId);

    const tStatus = useTranslations("SnippetStatus");

    const toggleLike = async () => {
        if (!userId) {
            router.push("/login");
            return;
        }

        setLikes((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );

        try {
            const res = await fetch(`/api/snippets/${snippetId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) throw new Error("Failed to update like status");

            const data = await res.json();
            setLikes(data.likes);
        } catch (err) {
            console.error(err);
            setLikes(initialLikes);
        }
    };

    return (
        <Button
            variant="outline"
            className=""
            onClick={(e) => {
                e.stopPropagation();
                toggleLike();
            }}
        >
            {isLiked ? <Heart fill="#FF0000" color="#FF0000" /> : <HeartPlus />}
            {tStatus("favorite")} {showFavoriteCount && <Badge variant="secondary">{likes.length}</Badge>}
        </Button>
    );
}
