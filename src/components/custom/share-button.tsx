"use client";

import { Button } from "@/components/ui/button";
import {Check, Share2} from "lucide-react";
import { toast } from "sonner";
import {useState} from "react";

export default function ShareButton() {
    const [shared, setShared] = useState(false);

    const handleShare = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            toast.success("URL copied to clipboard!！");
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } catch (err) {
            toast.error("Failed to copy URL");
            console.error(err);
        }
    };

    return (
        <Button variant="outline" size="icon" onClick={handleShare}>
            {shared ? <Check /> : <Share2 />}
        </Button>
);
}
