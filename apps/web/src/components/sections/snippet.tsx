"use client";

import CodeBlock from "@/components/custom/common/code-block";
import SnippetTags from "@/components/custom/snippet/tags";
import LikeButton from "@/components/custom/common/like-button";
import { useSession } from "next-auth/react";
import { capitalizeFirstLetter, utcToLocalDate } from "@/lib/utils";
import ShareButton from "@/components/custom/common/share-button";
import { Button } from "../ui/button";
import { Heart, MessageSquare, Pencil, Trash } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentSection from "@/components/custom/snippet/comment-section";

interface Author {
    _id: string;
    name: string;
    username: string;
    image?: string;
}

interface SnippetProps {
    snippet: {
        _id: string;
        title: string;
        desc: string;
        language: string;
        code: string;
        tags: string[];
        isPublic: boolean;
        author: Author;
        likes: string[];
        commentsCount?: number;
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
        router.push(`/snippets/edit/${id}`);
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
        <section className="w-full max-w-6xl mt-8 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {snippet.title}
                    <Badge variant="outline">
                        {snippet.isPublic ? (
                            tStatus("public")
                        ) : (
                            tStatus("private")
                        )}
                    </Badge>
                </h1>
                <div className="flex items-center gap-2 shrink-0">
                    {session?.user?.id === snippet.author._id && (
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="hover:cursor-pointer"
                                    onClick={() => jumpToEdit(snippet._id)}>
                                <Pencil className="mr-1"/>
                                {t("edit")}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="hover:cursor-pointer">
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
                        showFavoriteCount={false}
                        snippetId={String(snippet._id)}
                        initialLikes={snippet.likes}
                        userId={session?.user?.id}
                    />
                </div>


            </div>
            <Separator className="mb-2"/>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
                    <Tabs defaultValue="code">
                        <TabsList variant="line">
                            <TabsTrigger value="code" className="cursor-pointer">{t("tabs.code")}</TabsTrigger>
                            <TabsTrigger value="comments" className="cursor-pointer">
                                {t("tabs.comments")}{typeof snippet.commentsCount === "number" ? ` (${snippet.commentsCount})` : ""}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="code" className="mt-4">
                            <CodeBlock code={snippet.code} language={snippet.language}/>
                        </TabsContent>
                        <TabsContent value="comments" className="mt-4">
                            <CommentSection snippetId={snippet._id} snippetAuthorId={snippet.author._id}/>
                        </TabsContent>
                    </Tabs>
                </div>

                <aside className="w-full lg:w-72 shrink-0 mt-2">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-sm font-semibold mb-2">{t("about")}</h2>
                            {snippet.desc ? (
                                <p className="text-sm text-foreground/70">{snippet.desc}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">{t("no_desc")}</p>
                            )}
                        </div>

                        <Separator/>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">{t("author")}</span>
                            <a
                                href={`/users/${snippet.author.username}`}
                                className="text-sm font-semibold hover:underline w-fit"
                            >
                                {snippet.author.name}
                            </a>
                        </div>

                        <Separator/>

                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground">{t("language")}</span>
                            <Badge variant="secondary" className="w-fit">
                                {capitalizeFirstLetter(snippet.language)}
                            </Badge>
                        </div>

                        {snippet.tags?.length > 0 && (
                            <>
                                <Separator/>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-muted-foreground">{t("tags")}</span>
                                    <SnippetTags language="" tags={snippet.tags}/>
                                </div>
                            </>
                        )}

                        <Separator/>

                        <div className="flex items-center gap-4 text-sm text-foreground/80">
                            <span className="flex items-center gap-1.5">
                                <Heart className="size-4"/>
                                {snippet.likes?.length ?? 0}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageSquare className="size-4"/>
                                {snippet.commentsCount ?? 0}
                            </span>
                        </div>

                        <Separator/>

                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <span>{t("updated_at")}: {utcToLocalDate(snippet.updatedAt, true)}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
