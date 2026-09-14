import {AssistantChat} from "@/components/sections/assistant-chat";
import {getTranslations} from "next-intl/server";

export default async function AssistantPage() {
    const t = await getTranslations("AssistantPage");

    return (
        <main className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center gap-6">
            <div className="w-full max-w-5xl px-4 py-6 flex flex-col gap-8 sm:gap-10">
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">{t("desc")}</p>
                    <AssistantChat />
                </div>
            </div>
        </main>
    )
}
