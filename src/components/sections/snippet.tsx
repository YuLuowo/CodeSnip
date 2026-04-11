"use client";

import CodeBlock from "@/components/custom/code-block";
import SnippetTags from "@/components/custom/snippet-tags";
import LikeButton from "@/components/custom/like-button";
import { useSession } from "next-auth/react";
import { utcToLocalDate } from "@/lib/utils";
import ShareButton from "@/components/custom/share-button";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { Badge } from "@/components/ui/badge";

interface Author {
    _id: string;
    name: string;
    image?: string;
}

interface SnippetProps {
    snippet: {
        _id: string;
        title: string;
        language: string;
        code: string;
        tags: string[];
        isPublic: boolean;
        author: Author;
        likes: string[];
        createdAt: string;
        updatedAt: string;
    };
}

export default function SnippetView({snippet}: SnippetProps) {
    const {data: session} = useSession();
    const router = useRouter();
    const [loadingDelete, setLoadingDelete] = useState(false);

    const t = useTranslations("SnippetView");
    const tStatus = useTranslations("SnippetStatus");

    const jumpToEdit = (id: string) => {
        router.push(`/edit/${id}`);
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const res = await fetch(`/api/snippets/${snippet._id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(t("delete_dialog.error"));
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <section className="w-full max-w-5xl mt-6 px-4">
            <h1 className="text-2xl font-bold mb-2">
                <div className="flex items-center gap-2">
                    {snippet.title}
                    <Badge variant="outline">
                        {snippet.isPublic ? (
                            tStatus("public")
                        ) : (
                            tStatus("private")
                        )}
                    </Badge>
                </div>
            </h1>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
                <div className="flex flex-col justify-center">
                    <span className="text-base text-foreground font-semibold">
                        {t("author")}: {snippet.author.name}
                    </span>
                    <span className="text-xs text-foreground/50">
                        {t("updated_at")}: {utcToLocalDate(snippet.updatedAt)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {session?.user?.id === snippet.author._id && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="hover:cursor-pointer"
                                    onClick={() => jumpToEdit(snippet._id)}>
                                <Pencil className="mr-1"/>
                                {t("edit")}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="hover:cursor-pointer">
                                        <Trash className="mr-1"/>
                                        {t("delete")}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t("delete_dialog.title")}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t("delete_dialog.sub_title")}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t("delete_dialog.cancel")}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={loadingDelete}
                                        >
                                            {loadingDelete ? t("delete_dialog.deleting") : t("delete_dialog.continue")}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    <ShareButton/>
                    <LikeButton
                        showFavoriteCount={true}
                        snippetId={String(snippet._id)}
                        initialLikes={snippet.likes}
                        userId={session?.user?.id}
                    />
                </div>
            </div>
            <div className="pt-2 pb-3">
                <SnippetTags language={snippet.language} tags={snippet.tags}/>
            </div>
            <CodeBlock code={snippet.code} language={snippet.language}/>
        </section>
    );
}
