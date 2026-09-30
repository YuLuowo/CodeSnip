import { Button } from "@/components/ui/button";
import { DashedGridBackground } from "@/components/custom/common/dashed-grid-background";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function FinalCta() {
    const t = await getTranslations("FinalCta");

    return (
        <section className="relative flex flex-col items-center justify-center gap-4 px-6 md:px-20 py-16 md:py-24 mx-auto max-w-6xl w-full overflow-hidden my-8">
            <DashedGridBackground maskClassName="[mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />

            <h2 className="text-2xl md:text-4xl font-semibold text-center tracking-tight">{t("title")}</h2>
            <span className="text-sm md:text-base max-w-xl text-center text-muted-foreground">
                {t("desc")}
            </span>
            <Link href="/snippets/create">
                <Button className="hover:cursor-pointer">
                    {t("cta")}
                </Button>
            </Link>
        </section>
    );
}
