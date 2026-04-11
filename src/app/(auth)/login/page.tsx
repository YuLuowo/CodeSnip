import { LoginForm } from "@/components/sections/login-form"
import { Code } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="bg-accent relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-6">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Code className="size-4" />
                    </div>
                    Code Snippet
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
