"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartPlus } from "lucide-react";
import {useRouter} from "next/navigation";

interface LikeButtonProps {
    snippetId: string;
    initialLikes: string[];
    userId?: string;
    className?: string;
}

export default function LikeButton({
                                       snippetId,
                                       initialLikes,
                                       userId,
                                       className,
                                   }: LikeButtonProps) {
    const [likes, setLikes] = useState<string[]>(initialLikes);
    const router = useRouter();
    const isLiked = likes.some((id) => id === userId);

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
        } catch (err) {
            console.error(err);
            setLikes(initialLikes);
        }
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className={className}
            onClick={(e) => {
                e.stopPropagation();
                toggleLike();
            }}
        >
            {isLiked ? <Heart fill="#FF0000" color="#FF0000" /> : <HeartPlus />}
        </Button>
    );
}
