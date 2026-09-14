"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

const components: Components = {
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="mb-2 last:mb-0 list-disc pl-5 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 last:mb-0 list-decimal pl-5 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {children}
        </a>
    ),
    h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-semibold mb-2">{children}</h3>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 pl-3 italic opacity-80 mb-2 last:mb-0">{children}</blockquote>
    ),
    hr: () => <hr className="my-2 border-border" />,
    table: ({ children }) => (
        <div className="overflow-x-auto mb-2 last:mb-0">
            <table className="border-collapse text-xs">{children}</table>
        </div>
    ),
    th: ({ children }) => <th className="border px-2 py-1 text-left font-semibold">{children}</th>,
    td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
};

function CodeRenderer({
    inline,
    className,
    children,
    resolvedTheme,
}: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    resolvedTheme?: string;
}) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");

    if (inline || !match) {
        return (
            <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[0.85em] font-mono">
                {children}
            </code>
        );
    }

    return (
        <div className="rounded-md overflow-hidden my-2 border">
            <SyntaxHighlighter
                language={match[1]}
                style={resolvedTheme === "dark" ? oneDark : oneLight}
                wrapLongLines
                customStyle={{
                    fontSize: "13px",
                    margin: 0,
                    padding: "0.75rem",
                    background: "transparent",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

export function MarkdownContent({ content }: { content: string }) {
    const { resolvedTheme } = useTheme();

    return (
        <div className="text-sm sm:text-base">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    ...components,
                    code: (props) => <CodeRenderer {...props} resolvedTheme={resolvedTheme} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
