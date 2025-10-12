"use client";

import {
    Field, FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import CodeEditor from "@/components/editor/code-editor";
import MultiSelect from "@/components/custom/multi-select";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {redirect, useRouter} from 'next/navigation';
import {Spinner} from "@/components/ui/spinner";
import {useSession} from "next-auth/react";

interface Snippet {
    _id: string;
    title: string;
    language: string;
    code: string;
    tags: string[];
    isPublic: boolean;
}

interface EditSnippetProps {
    snippet: Snippet;
}

export default function EditSnippet({ snippet }: EditSnippetProps) {
    const [title, setTitle] = useState(snippet.title);
    const [language, setLanguage] = useState(snippet.language);
    const [code, setCode] = useState(snippet.code);
    const [tags, setTags] = useState<string[]>(snippet.tags || []);
    const [isPublic, setIsPublic] = useState<boolean>(snippet.isPublic);

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ title?: string; language?: string }>({});

    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
        }
    }, [status, router]);


    useEffect(() => {
        if (errors.title && title.trim()) {
            setErrors((prev) => ({ ...prev, title: undefined }));
        }
    }, [title, errors.title]);

    const handleSubmit = async () => {
        const newErrors: typeof errors = {};
        if (!title.trim()) newErrors.title = "Title is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.values(newErrors).forEach((msg) => toast.error(msg));
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch(`/api/snippets/${snippet._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    code,
                    tags,
                    isPublic,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error("Failed to update snippet");
                throw new Error(data.message);
            }

            toast.success("Snippet updated successfully!");
            router.push(`/snippets/${snippet._id}`);
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">Edit Snippet</h3>
            <span className="text-sm text-muted-foreground">Update your snippet below.</span>
            <FieldSet className="pt-4">
                <FieldGroup>
                    <Field className="max-w-sm">
                        <FieldLabel htmlFor="title">Snippet Title *</FieldLabel>
                        <Input
                            id="title"
                            type="text"
                            maxLength={30}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                            <FieldDescription className="text-red-500">{errors.title}</FieldDescription>
                        )}
                    </Field>

                    <Field className="max-w-xs">
                        <FieldLabel htmlFor="language">Language</FieldLabel>
                        <Select disabled value={language}>
                            <SelectTrigger id="language">
                                <SelectValue placeholder={language} />
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
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel>Code</FieldLabel>
                        <CodeEditor
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Tags</FieldLabel>
                        <FieldDescription>Select the tags you want to display on your snippet.</FieldDescription>
                        <MultiSelect
                            value={tags}
                            onChange={(tags) => setTags(tags)}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Choose visibility *</FieldLabel>
                        <FieldDescription>Select whether this snippet is visible to others or only to yourself.</FieldDescription>
                        <div className="flex flex-col gap-2">
                            <label className="flex flex-row cursor-pointer bg-background px-4 py-2 border rounded gap-4 hover:bg-gray-50 dark:hover:bg-input/10">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(true)}
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">Public</span>
                                    <span className="text-sm text-gray-600">Visible to everyone, anyone can see this snippet.</span>
                                </div>
                            </label>

                            <label className="flex flex-row cursor-pointer bg-background px-4 py-2 border rounded gap-4 hover:bg-gray-50 dark:hover:bg-input/10">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={!isPublic}
                                    onChange={() => setIsPublic(false)}
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">Private</span>
                                    <span className="text-sm text-gray-600">Only you can see this snippet.</span>
                                </div>
                            </label>
                        </div>
                    </Field>

                    <div className="flex justify-start gap-2 mt-4 mb-12">
                        <Button variant="outline" className="cursor-pointer" disabled={loading} onClick={handleSubmit}>
                            { loading && <Spinner /> }
                            <span>{ loading ? "Loading ..." : "Update" }</span>
                        </Button>

                        <Button variant="ghost" className="cursor-pointer" disabled={loading} onClick={() => router.push(`/snippets/${snippet._id}`)}>
                            Back
                        </Button>
                    </div>
                </FieldGroup>
            </FieldSet>
        </section>
    );
}
