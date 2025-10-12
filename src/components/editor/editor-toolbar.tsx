"use client";

import { Button } from "@/components/ui/button";
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {Check, ClipboardPaste, Copy, Trash} from "lucide-react";
import React, {useState} from "react";
import * as monaco from "monaco-editor";

interface EditorToolbarProps {
    editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export function EditorToolBar({ editorRef }: EditorToolbarProps){

    const [copied, setCopied] = useState(false);
    const [pasted, setPasted] = useState(false);

    const handleCopy = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePaste = async () => {
        if (editorRef.current) {
            const text = await navigator.clipboard.readText();
            editorRef.current.executeEdits('', [
                { range: editorRef.current.getSelection()!, text }
            ]);
            setPasted(true);
            setTimeout(() => setPasted(false), 2000);
        }
    };

    const handleClear = () => {
        editorRef.current?.setValue('');
    };

    return (
        <div className="flex justify-end items-center p-2">
            <ButtonGroup>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={ handleCopy }>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
                </Tooltip>
                <ButtonGroupSeparator />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={handlePaste}>
                            {pasted ? <Check className="w-4 h-4" /> : <ClipboardPaste className="w-4 h-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{pasted ? "Pasted" : "Paste"}</TooltipContent>
                </Tooltip>
                <ButtonGroupSeparator />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={handleClear}>
                            <Trash className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear</TooltipContent>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
}