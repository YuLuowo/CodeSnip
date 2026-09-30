"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { SearchIcon } from "lucide-react";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Spinner } from "@/components/ui/spinner";

const debounceSnippet = `function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}`;

export function SyntaxVisual() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
            <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive/70" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                <span className="h-2 w-2 rounded-full bg-green-500/70" />
                <span className="ml-1 text-[10px] font-medium text-muted-foreground">useDebounce.js</span>
            </div>
            <div className="mask-b-from-70% relative flex-1 overflow-hidden">
                <SyntaxHighlighter
                    language="javascript"
                    style={resolvedTheme === "dark" ? oneDark : oneLight}
                    customStyle={{
                        fontSize: "10px",
                        lineHeight: "1.5",
                        margin: 0,
                        padding: "0.75rem",
                        background: "transparent",
                    }}
                >
                    {debounceSnippet}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

const profileLanguages = [
    { label: "TypeScript", percentage: 62 },
    { label: "Python", percentage: 28 },
];

function ProgressBar({ percentage }: { percentage: number }) {
    return (
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-background">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-primary/70"
            />
        </div>
    );
}

export function PublicProfileVisual() {
    return (
        <div className="flex h-full w-full flex-col gap-2 rounded-md bg-muted/50 p-3 text-[10px]">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary/60 to-primary/20" />
                <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-xs font-semibold text-foreground">YuLuowo</span>
                    <span className="truncate text-[10px] text-muted-foreground">@yuluowo</span>
                </div>
                <span className="ml-auto shrink-0 rounded-full border bg-background px-2 py-1 text-[10px] text-muted-foreground">
                    Follow
                </span>
            </div>
            <p className="truncate text-muted-foreground">Building tools for developers, one snippet at a time.</p>
            <div className="flex items-center gap-3 border-y py-1.5 text-muted-foreground">
                <span><b className="text-foreground">128</b> Snippets</span>
                <span><b className="text-foreground">1.2k</b> Followers</span>
                <span><b className="text-foreground">86</b> Following</span>
            </div>
            <div className="flex flex-col gap-1">
                {profileLanguages.map((lang) => (
                    <div key={lang.label} className="flex items-center gap-2">
                        <span className="w-14 shrink-0 truncate text-muted-foreground">{lang.label}</span>
                        <ProgressBar percentage={lang.percentage} />
                        <span className="w-7 shrink-0 text-right text-muted-foreground">{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const searchWords = ["useDebounce", "quicksort algorithm", "fetch with retry"];
const searchResults = ["debounce.js · JavaScript", "throttle.ts · TypeScript"];

export function SearchVisual() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md bg-muted/50 p-4">
            <div className="flex w-full max-w-56 items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
                <SearchIcon className="h-3.5 w-3.5 shrink-0" />
                <TypingAnimation
                    words={searchWords}
                    loop
                    typeSpeed={70}
                    pauseDelay={1200}
                    showCursor
                    blinkCursor
                    cursorStyle="line"
                    className="text-xs text-foreground"
                />
            </div>
            <div className="flex w-full max-w-56 flex-col gap-1.5">
                {searchResults.map((label, index) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 * index }}
                        className="truncate rounded-md border bg-background px-2 py-1 text-[10px] text-muted-foreground"
                    >
                        {label}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const discordSearchResults = [
    { title: "useDebounce.js", author: "alexchen", language: "JavaScript", likes: 24, comments: 3 },
    { title: "throttle.ts", author: "jamiedev", language: "TypeScript", likes: 11, comments: 1 },
];

export function DiscordVisual() {
    return (
        <div className="flex h-full w-full flex-col gap-2 rounded-md bg-muted/50 p-3 text-[10px]">
            <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-[10px] font-bold text-white">
                    /
                </span>
                <div className="rounded-md bg-background px-2 py-1 text-muted-foreground">
                    /search useDebounce
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="ml-7 flex gap-2 rounded-md border-l-2 border-l-[#5865F2] bg-background p-2"
            >
                <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-semibold text-foreground">Search results for &quot;useDebounce&quot;</span>
                    {discordSearchResults.map((result) => (
                        <div key={result.title} className="flex flex-col gap-0.5 border-t pt-1 first:border-t-0 first:pt-0">
                            <span className="truncate font-medium text-foreground">{result.title}</span>
                            <span className="truncate text-muted-foreground">by {result.author} • {result.language}</span>
                            <span className="text-muted-foreground">♥ {result.likes} • 💬 {result.comments}</span>
                        </div>
                    ))}
                    <span className="pt-0.5 text-[9px] text-muted-foreground/70">CodeSnip</span>
                </div>
            </motion.div>
        </div>
    );
}

const assistantResults = ["UI_STYLE_GUIDE.md", "SKILLS.md"];

export function AIAssistantVisual() {
    const [phase, setPhase] = useState<"thinking" | "answered">("thinking");

    useEffect(() => {
        let answerTimer: ReturnType<typeof setTimeout>;
        let resetTimer: ReturnType<typeof setTimeout>;

        const cycle = () => {
            setPhase("thinking");
            answerTimer = setTimeout(() => setPhase("answered"), 2200);
            resetTimer = setTimeout(cycle, 6000);
        };
        cycle();

        return () => {
            clearTimeout(answerTimer);
            clearTimeout(resetTimer);
        };
    }, []);

    return (
        <div className="flex h-full w-full flex-col justify-end gap-2 rounded-md bg-muted/50 p-3">
            <div className="ml-auto max-w-[80%] rounded-lg bg-primary/90 px-3 py-1.5 text-[11px] text-primary-foreground">
                How to improve my UI?
            </div>
            <AnimatePresence mode="wait">
                {phase === "thinking" ? (
                    <motion.div
                        key="thinking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mr-auto flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-[11px] text-muted-foreground"
                    >
                        <Spinner className="size-3" />
                        <span>Thinking...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="answered"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mr-auto max-w-[85%] rounded-lg border bg-background p-2 text-[10px]"
                    >
                        <p className="mb-1 text-muted-foreground">
                            Here are the most relevant AI resources from CodeSnip for your query:
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {assistantResults.map((title) => (
                                <span key={title} className="truncate text-primary">
                                    • {title}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
