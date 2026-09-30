import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FaDiscord } from "react-icons/fa";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "1550780666155630714";
const DISCORD_INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=0&scope=bot%20applications.commands`;

const MOCK_RESULTS = [
    {
        title: "debounce.js",
        author: "yuluo",
        language: "JavaScript",
        likes: 12,
        comments: 3,
    },
    {
        title: "useDebounce.ts",
        author: "codesnip",
        language: "TypeScript",
        likes: 8,
        comments: 1,
    },
];

export async function BotSpotlight() {
    const t = await getTranslations("BotSpotlight");

    return (
        <section className="flex flex-col items-center justify-center gap-8 py-12 md:py-24 border-x border-dashed border-border divide-y divide-dashed divide-border md:divide-y-0 md:divide-x">

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full px-12 overflow-hidden border-y border-dashed border-border">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-muted-foreground">
                        {t("badge")}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-semibold">{t("title")}</h2>
                    <p className="text-muted-foreground text-xs md:text-sm">{t("desc")}</p>
                    <div>
                        <Link href={DISCORD_INVITE_URL} target="_blank">
                            <Button className="w-fit hover:cursor-pointer">{t("cta")}</Button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center p-6 md:p-10">
                    <div className="w-full rounded-xl border bg-[#313338] shadow-lg text-white font-mono text-sm overflow-hidden">
                        <div className="flex items-center gap-2 p-4 pb-3">
                            <Avatar size="sm">
                                <AvatarFallback className="bg-[#5865f2] text-white">
                                    <FaDiscord />
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">CodeSnip Bot</span>
                        </div>
                        <p className="text-gray-300 px-4 pb-3">/search keyword: debounce</p>
                        <div className="mx-4 mb-4 flex rounded-md bg-[#2b2d31] overflow-hidden">
                            <div className="w-1 shrink-0 bg-primary" />
                            <div className="flex-1 p-3">
                                <p className="font-semibold text-[15px]">
                                    Search results for &quot;debounce&quot;
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                    Showing the top {MOCK_RESULTS.length} snippet(s)
                                </p>
                                <div className="mt-3 flex flex-col gap-2.5">
                                    {MOCK_RESULTS.map((result) => (
                                        <div key={result.title}>
                                            <p className="text-sky-400 text-xs font-semibold hover:underline">
                                                {result.title}
                                            </p>
                                            <p className="text-gray-300 text-xs leading-snug">
                                                by {result.author}
                                                <br />
                                                Language: {result.language}
                                                <br />
                                                Likes: {result.likes} &bull; Comments: {result.comments}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sky-400 text-xs mt-3 hover:underline">
                                    View all results on the website
                                </p>
                                <p className="text-gray-500 text-[10px] mt-3">CodeSnip</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
