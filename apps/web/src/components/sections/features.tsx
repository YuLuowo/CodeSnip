import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import ScrollVelocity from "@/components/ui/scroll-velocity";
import { languageMaps, tagKeys } from "@/configs/maps";
import { cn } from "cn";
import {
    SyntaxVisual,
    PublicProfileVisual,
    SearchVisual,
    DiscordVisual,
    AIAssistantVisual,
} from "@/components/sections/feature-visuals";

async function OrganizationVisual() {
    const tTags = await getTranslations("SnippetTags.tags");
    return (
        <div className="mask-l-from-90% mask-r-from-90% w-full overflow-hidden">
            <ScrollVelocity
                texts={[(
                    <div key="tags" className="flex items-center gap-2 mr-2">
                        {tagKeys.map((tag) => {
                            return (
                                <div key={tag} className="bg-accent/50 px-3 py-2 rounded-md cursor-pointer hover:bg-accent/75 text-muted-foreground hover:text-primary/80">
                                    <span>{tTags(tag)}</span>
                                </div>
                            );
                        })}
                    </div>
                ), (
                    <div key="languages" className="flex items-center gap-2 mr-2">
                        {Object.values(languageMaps).flatMap((group) =>
                            Object.values(group)
                        ).map((language) => (
                            <div key={language} className="bg-accent/50 px-3 py-2 rounded-md cursor-pointer hover:bg-accent/75 text-muted-foreground hover:text-primary/80">
                                <span>{language}</span>
                            </div>
                        ))}
                    </div>
                )]}
                velocity={50}
                numCopies={3}
                damping={50}
                stiffness={400}
                velocityMapping={{
                    input: [0, 1000],
                    output: [0, 0],
                }}
            />
        </div>
    );
}

const visuals = [
    OrganizationVisual,
    SyntaxVisual,
    PublicProfileVisual,
    SearchVisual,
    DiscordVisual,
    AIAssistantVisual,
];

const cardSpans = [
    "md:col-span-4",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-4",
];

export async function Features() {
    const t = await getTranslations("Features");
    const items = t.raw("items") as { title: string; desc: string }[];

    return (
        <section className="flex flex-col items-center justify-center w-full max-w-7xl min-h-screen px-4 py-16">
            <div className="flex flex-col items-center justify-center gap-4 mb-12 w-full">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-muted-foreground">
                    {t("badge")}
                </Badge>
                <h2 className="text-3xl md:text-3xl font-semibold text-center">{t("title")}</h2>
                <span className="text-sm md:text-base text-center text-muted-foreground">
                    {t("desc")}
                </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-10">
                {items.map((item, index) => {
                    const Visual = visuals[index % visuals.length];

                    return (
                        <Card key={item.title} className={cn(
                            "overflow-hidden bg-background p-2 gap-2 hover:border-primary/20 hover:-translate-y-0.5 transition-transform duration-200",
                            cardSpans[index % cardSpans.length]
                        )}>
                            <CardContent className="p-0">
                                <div className="border rounded-lg h-42.5 bg-muted/40 flex items-center overflow-hidden select-none">
                                    <Visual />
                                </div>
                            </CardContent>
                            <CardHeader className="px-3 py-3">
                                <CardTitle className="text-base">{item.title}</CardTitle>
                                <CardDescription className="text-xs">{item.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>
        </section>
    )
}
