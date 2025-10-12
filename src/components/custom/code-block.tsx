"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyIcon, CheckIcon } from "lucide-react";
import {useDarkMode} from "@/components/providers/theme-provider";

export default function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false);
    const { darkMode } = useDarkMode();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-md border bg-accent">
            <div className="absolute top-2 right-2 z-10">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:cursor-pointer"
                            onClick={handleCopy}
                        >
                            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        {copied ? "Copied!" : "Copy"}
                    </TooltipContent>
                </Tooltip>
            </div>

            <SyntaxHighlighter
                language={language}
                style={darkMode ? vscDarkPlus : oneLight}
                showLineNumbers
                wrapLongLines
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "transparent",
                    maxHeight: "600px",
                    overflowY: "auto",
                    height: "500px",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}