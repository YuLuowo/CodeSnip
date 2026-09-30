"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { File, Folder, Tree } from "@/components/ui/file-tree";
import CodeBlock from "@/components/custom/common/code-block";
import { useTranslations } from "use-intl";

interface Snippet {
    id: string;
    fileName: string;
    language: string;
    code: string;
}

const snippets: Snippet[] = [
    {
        id: "debounce",
        fileName: "debounce.js",
        language: "javascript",
        code: `function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}`,
    },
    {
        id: "chunk",
        fileName: "chunk.py",
        language: "python",
        code: `def chunk(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]`,
    },
    {
        id: "contains",
        fileName: "contains.go",
        language: "go",
        code: `func Contains[T comparable](items []T, target T) bool {
    for _, item := range items {
        if item == target {
            return true
        }
    }
    return false
}`,
    },
];

export function Examples() {
    const t = useTranslations("Examples");
    const [activeId, setActiveId] = useState(snippets[0].id);
    const activeSnippet = snippets.find((s) => s.id === activeId) ?? snippets[0];

    return (
        <section id="examples" className="flex flex-col items-center justify-center gap-4 px-6 md:px-20 py-8 md:py-16 max-w-6xl w-full">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-muted-foreground">
                {t("badge")}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-semibold text-center">{t("title")}</h2>
            <span className="text-sm md:text-base text-center mb-4 text-muted-foreground">
                {t("desc")}
            </span>

            <div className="w-full max-w-3xl mt-4 flex flex-col overflow-hidden rounded-lg border shadow-sm md:flex-row">
                <div className="w-full shrink-0 border-b bg-muted/30 md:w-48 md:border-b-0 md:border-r">
                    <Tree
                        className="h-full py-2"
                        initialSelectedId={activeId}
                        initialExpandedItems={["snippets"]}
                    >
                        <Folder value="snippets" element="snippets">
                            {snippets.map((snippet) => (
                                <File
                                    key={snippet.id}
                                    value={snippet.id}
                                    isSelect={activeId === snippet.id}
                                    handleSelect={() => setActiveId(snippet.id)}
                                >
                                    <span>{snippet.fileName}</span>
                                </File>
                            ))}
                        </Folder>
                    </Tree>
                </div>

                <div className="min-w-0 flex-1 bg-card p-2 md:p-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSnippet.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <CodeBlock
                                code={activeSnippet.code}
                                language={activeSnippet.language}
                                fileName={activeSnippet.fileName}
                                maxHeight="320px"
                                className="border-none shadow-none min-h-[400px]"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
