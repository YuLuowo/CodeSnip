import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
    const t = await getTranslations("HowItWorks");
    const steps = t.raw("steps") as { title: string; desc: string }[];

    return (
        <section className="flex flex-col items-center justify-center gap-4 px-6 md:px-20 py-12 md:py-24">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-muted-foreground">
                {t("badge")}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-semibold text-center">{t("title")}</h2>
            <span className="text-sm md:text-base max-w-2xl text-center mb-4 text-muted-foreground">
                {t("desc")}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-4">
                {steps.map((step, index) => (
                    <div key={step.title} className="relative flex flex-col items-center text-center gap-2">
                        {index < steps.length - 1 && (
                            <div className="hidden md:block absolute top-5 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] border-t border-dashed border-border" />
                        )}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground font-semibold z-10 border">
                            {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
