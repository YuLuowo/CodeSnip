import { LoginForm } from "@/components/sections/login-form"

export default function LoginPage() {
    return (
        <main className="bg-muted relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center gap-6">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <LoginForm />
            </div>
        </main>
    );
}
