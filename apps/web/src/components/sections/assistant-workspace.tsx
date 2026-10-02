"use client";

import { useState } from "react";
import { ISnippetClient } from "@/configs/types";
import { AssistantChat } from "@/components/sections/assistant-chat";
import { AssistantPreviewPanel, SnippetReason } from "@/components/sections/assistant-preview-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "use-intl";

type MobileTab = "chat" | "result";

export function AssistantWorkspace() {
    const t = useTranslations("AssistantPage.workspace");
    const [snippets, setSnippets] = useState<ISnippetClient[]>([]);
    const [reasons, setReasons] = useState<SnippetReason[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileTab, setMobileTab] = useState<MobileTab>("chat");

    const handleResult = (newSnippets: ISnippetClient[], newReasons: SnippetReason[]) => {
        setSnippets(newSnippets);
        setReasons(newReasons);
        setActiveIndex(0);
        if (newSnippets.length > 0) setMobileTab("result");
    };

    return (
        <div className="flex flex-col gap-1.5 md:gap-4 pt-2 md:pt-0">
            {/* Mobile tab switcher */}
            <div className="flex gap-2 lg:hidden">
                <Button
                    size="sm"
                    variant={mobileTab === "chat" ? "default" : "outline"}
                    onClick={() => setMobileTab("chat")}
                >
                    {t("tabs.chat")}
                </Button>
                <Button
                    size="sm"
                    variant={mobileTab === "result" ? "default" : "outline"}
                    disabled={snippets.length === 0}
                    onClick={() => setMobileTab("result")}
                >
                    {t("tabs.result")}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
                <div className={cn(mobileTab === "result" ? "flex" : "hidden", "h-[85vh] flex-col lg:order-1 lg:flex")}>
                    <AssistantPreviewPanel
                        snippets={snippets}
                        reasons={reasons}
                        activeIndex={activeIndex}
                        onActiveIndexChange={setActiveIndex}
                    />
                </div>
                <div className={cn(mobileTab === "chat" ? "flex" : "hidden", "h-[85vh] flex-col lg:order-2 lg:flex")}>
                    <AssistantChat onResult={handleResult} />
                </div>
            </div>
        </div>
    );
}
