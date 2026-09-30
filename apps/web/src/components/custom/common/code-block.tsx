"use client";

import { useEffect, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "use-intl";
import { motion } from "motion/react";

interface CodeBlockProps {
    code: string;
    language: string;
    /** Optional file name shown in the window header, e.g. "debounce.js" */
    fileName?: string;
    /** Cap the code area height before it scrolls, defaults to "500px" */
    maxHeight?: string;
    className?: string;
}

export default function CodeBlock({ code, language, fileName, maxHeight = "500px", className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("SnippetView");

    useEffect(() => {
        setMounted(true);
    }, []);

    const lineCount = useMemo(() => code.split("\n").length, [code]);

    if (!mounted) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            key={fileName ?? code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-lg border bg-card shadow-sm ${className ?? ""}`}
        >
            <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex shrink-0 items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    </div>
                    {fileName && (
                        <span className="truncate text-xs font-medium text-muted-foreground">
                            {fileName}
                        </span>
                    )}

                    <Badge variant="secondary" className="shrink-0 text-[10px] font-medium uppercase tracking-wide">
                        {language}
                    </Badge>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                        {lineCount} lines
                    </span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:cursor-pointer"
                                onClick={handleCopy}
                            >
                                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            {copied ? t("copied") : t("copy")}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <SyntaxHighlighter
                language={language}
                style={resolvedTheme === "dark" ? oneDark : oneLight}
                showLineNumbers
                wrapLongLines
                customStyle={{
                    fontSize: "14px",
                    margin: 0,
                    padding: "1rem",
                    background: "transparent",
                    maxHeight,
                    overflow: "auto",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </motion.div>
    );
}