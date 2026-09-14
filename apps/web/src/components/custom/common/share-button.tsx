"use client";

import { Button } from "@/components/ui/button";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "use-intl";

export default function ShareButton() {
    const [shared, setShared] = useState(false);

    const t = useTranslations("SnippetView");

    const handleShare = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            toast.success(t("url_copied"));
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } catch (err) {
            toast.error(t("url_copied_failed"));
            console.error(err);
        }
    };

    return (
        <Button variant="outline" size="icon" onClick={handleShare}>
            {shared ? <Check/> : <Share2/>}
        </Button>
    );
}
