import {AssistantWorkspace} from "@/components/sections/assistant-workspace";

export default async function AssistantPage() {
    return (
        <main className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-6">
            <div className="w-full max-w-7xl px-4 py-3 flex flex-col gap-8 sm:gap-10">
                <AssistantWorkspace />
            </div>
        </main>
    )
}
