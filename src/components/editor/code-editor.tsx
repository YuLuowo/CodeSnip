"use client";

import { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useDarkMode } from "@/components/providers/theme-provider";
import {EditorToolBar} from "@/components/editor/editor-toolbar";
import {FieldSeparator} from "@/components/ui/field";

interface CodeEditorProps {
    language: string;
    value: string;
    onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof monaco | null>(null);
    const { darkMode } = useDarkMode();

    const defineThemes = (monacoInstance: typeof import("monaco-editor")) => {

        monacoInstance.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#09090BFF",           // 編輯器背景
                "editor.lineHighlightBackground": "#09090BFF", // 選中行背景跟編輯器背景相同
            },
        });
    };

    const handleEditorMount: OnMount = (editor, monacoInstance) => {
        editorRef.current = editor;
        monacoRef.current = monacoInstance;
        defineThemes(monacoInstance);
        monacoInstance.editor.setTheme(darkMode ? "custom-dark" : "vs-light");
    };

    useEffect(() => {
        if (monacoRef.current) {
            monacoRef.current.editor.setTheme(darkMode ? "custom-dark" : "vs-light");
        }
    }, [darkMode]);

    return (
        <div className="relative border overflow-hidden shadow-sm">
            <EditorToolBar editorRef={ editorRef } />
            <FieldSeparator />
            <Editor
                height="400px"
                language={language}
                value={value}
                onMount={handleEditorMount}
                onChange={onChange}
                options={{
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
                    fontLigatures: true,
                    folding: false,
                    glyphMargin: false,
                    guides: {
                        indentation: false,
                    },
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12 },
                    lineDecorationsWidth: 10,
                    scrollbar: {
                        vertical: "auto",
                        horizontal: "auto",
                        useShadows: false,
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                    },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    roundedSelection: true,
                    renderLineHighlight: "none"
                }}
            />
        </div>
    );
}