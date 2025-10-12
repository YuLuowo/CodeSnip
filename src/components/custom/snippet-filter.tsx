"use client";

import { SearchBar } from "@/components/custom/search-bar";
import MultiSelect from "@/components/custom/multi-select";
import {
    Field,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

interface SnippetFilterProps {
    onSearch?: (filters: {
        title: string;
        language: string;
        tags: string[];
    }) => void;
}

export default function SnippetFilter({ onSearch }: SnippetFilterProps) {
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        onSearch?.({ title, language, tags });
        setLoading(false);
    }, [title, language, tags, onSearch]);

    const handleClear = useCallback(() => {
        setTitle("");
        setLanguage("");
        setTags([]);
        onSearch?.({ title: "", language: "", tags: [] });
    }, [onSearch]);

    const handleTitleChange = useCallback((value: string) => {
        setTitle(value);
    }, []);

    const handleLanguageChange = useCallback((val: string) => {
        setLanguage(val);
    }, []);

    const handleTagsChange = useCallback((vals: string[]) => {
        setTags(vals);
    }, []);

    return (
        <div className="flex flex-col gap-4 border rounded-lg border-accent p-4">
            <h2 className="text-2xl font-semibold">Filters</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <Field className="md:max-w-xs">
                    <SearchBar value={title} onChange={handleTitleChange} />
                </Field>

                <Field className="md:max-w-xs">
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Choose Language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-100">
                            <SelectGroup>
                                <SelectLabel>Programming Languages</SelectLabel>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="typescript">TypeScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="c">C</SelectItem>
                                <SelectItem value="cpp">C++</SelectItem>
                                <SelectItem value="csharp">C#</SelectItem>
                                <SelectItem value="go">Go</SelectItem>
                                <SelectItem value="php">PHP</SelectItem>
                                <SelectItem value="ruby">Ruby</SelectItem>
                                <SelectItem value="swift">Swift</SelectItem>
                                <SelectItem value="kotlin">Kotlin</SelectItem>
                                <SelectItem value="rust">Rust</SelectItem>
                                <SelectItem value="dart">Dart</SelectItem>
                                <SelectItem value="scala">Scala</SelectItem>
                                <SelectItem value="r">R</SelectItem>
                            </SelectGroup>

                            <SelectSeparator />

                            <SelectGroup>
                                <SelectLabel>Web / Markup</SelectLabel>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="css">CSS</SelectItem>
                                <SelectItem value="scss">SCSS / SASS</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="markdown">Markdown</SelectItem>
                            </SelectGroup>

                            <SelectSeparator />

                            <SelectGroup>
                                <SelectLabel>Other</SelectLabel>
                                <SelectItem value="bash">Bash / Shell</SelectItem>
                                <SelectItem value="powershell">PowerShell</SelectItem>
                                <SelectItem value="sql">SQL</SelectItem>
                                <SelectItem value="yaml">YAML</SelectItem>
                                <SelectItem value="xml">XML</SelectItem>
                                <SelectItem value="dockerfile">Dockerfile</SelectItem>
                                <SelectItem value="graphql">GraphQL</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <Field>
                <FieldLabel>Tags</FieldLabel>
                <MultiSelect value={tags} onChange={handleTagsChange} />
            </Field>

            <div className="flex justify-end items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    Search
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleClear}
                    disabled={loading}
                >
                    Clear
                </Button>
            </div>
        </div>
    );
}
