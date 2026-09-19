"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "use-intl";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { utcToLocalDate } from "@/lib/utils";
import { CommentsResponse, ICommentClient } from "@/configs/types";

interface CommentSectionProps {
    snippetId: string;
    snippetAuthorId: string;
}

interface CommentItemProps {
    comment: ICommentClient;
    currentUserId?: string;
    snippetAuthorId: string;
    onReplySubmit: (parentId: string, content: string) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
}

function CommentItem({ comment, currentUserId, snippetAuthorId, onReplySubmit, onDelete }: CommentItemProps) {
    const t = useTranslations("Comment");
    const [replying, setReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const canDelete = (authorId: string) =>
        currentUserId && (currentUserId === authorId || currentUserId === snippetAuthorId);

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        setSubmittingReply(true);
        try {
            await onReplySubmit(comment._id, replyContent.trim());
            setReplyContent("");
            setReplying(false);
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await onDelete(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex gap-3">
            <Link href={`/users/${comment.author.username}`} className="shrink-0">
                <Avatar size="sm">
                    <AvatarImage src={comment.author.image ?? undefined} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-sm">
                        <Link href={`/users/${comment.author.username}`} className="font-semibold hover:underline">
                            {comment.author.name}
                        </Link>{" "}
                        <span className="text-xs text-muted-foreground">
                            {utcToLocalDate(comment.createdAt, true)}
                        </span>
                    </div>

                    {canDelete(comment.author._id) && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-6 cursor-pointer text-muted-foreground hover:text-destructive">
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t("delete_dialog.title")}</AlertDialogTitle>
                                    <AlertDialogDescription>{t("delete_dialog.sub_title")}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t("delete_dialog.cancel")}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(comment._id)}
                                        disabled={deletingId === comment._id}
                                    >
                                        {deletingId === comment._id ? t("delete_dialog.deleting") : t("delete_dialog.continue")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>

                <button
                    type="button"
                    onClick={() => setReplying((prev) => !prev)}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1.5 cursor-pointer"
                >
                    {t("reply")}
                </button>

                {replying && (
                    <div className="flex flex-col gap-2 mt-2">
                        <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={t("reply_placeholder")}
                            className="min-h-16 text-sm"
                        />
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="cursor-pointer" onClick={handleReplySubmit} disabled={submittingReply || !replyContent.trim()}>
                                {submittingReply ? t("submitting") : t("reply_submit")}
                            </Button>
                            <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => setReplying(false)}>
                                {t("cancel")}
                            </Button>
                        </div>
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="flex flex-col gap-4 mt-4 pl-4 border-l border-border">
                        {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex gap-3">
                                <Link href={`/users/${reply.author.username}`} className="shrink-0">
                                    <Avatar size="sm">
                                        <AvatarImage src={reply.author.image ?? undefined} alt={reply.author.name} />
                                        <AvatarFallback>{reply.author.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm">
                                            <Link href={`/users/${reply.author.username}`} className="font-semibold hover:underline">
                                                {reply.author.name}
                                            </Link>{" "}
                                            <span className="text-xs text-muted-foreground">
                                                {utcToLocalDate(reply.createdAt, true)}
                                            </span>
                                        </div>
                                        {canDelete(reply.author._id) && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-6 cursor-pointer text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{t("delete_dialog.title")}</AlertDialogTitle>
                                                        <AlertDialogDescription>{t("delete_dialog.sub_title")}</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>{t("delete_dialog.cancel")}</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(reply._id)}
                                                            disabled={deletingId === reply._id}
                                                        >
                                                            {deletingId === reply._id ? t("delete_dialog.deleting") : t("delete_dialog.continue")}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                    <p className="text-sm mt-1 whitespace-pre-wrap break-words">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentSection({ snippetId, snippetAuthorId }: CommentSectionProps) {
    const { data: session } = useSession();
    const t = useTranslations("Comment");

    const [comments, setComments] = useState<ICommentClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async (pageToFetch: number, append: boolean) => {
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const res = await fetch(`/api/snippets/${snippetId}/comments?page=${pageToFetch}&limit=10`);
            if (!res.ok) throw new Error("Failed to fetch comments");

            const data: CommentsResponse = await res.json();
            setComments((prev) => (append ? [...prev, ...data.comments] : data.comments));
            setTotalPages(data.pagination.totalPages);
            setPage(data.pagination.page);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchComments(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snippetId]);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/snippets/${snippetId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content.trim() }),
            });
            if (!res.ok) throw new Error("Failed to post comment");

            const data = await res.json();
            setComments((prev) => [{ ...data.comment, replies: [] }, ...prev]);
            setContent("");
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplySubmit = async (parentId: string, replyContent: string) => {
        const res = await fetch(`/api/snippets/${snippetId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: replyContent, parentComment: parentId }),
        });
        if (!res.ok) throw new Error("Failed to post reply");

        const data = await res.json();
        setComments((prev) =>
            prev.map((c) =>
                c._id === parentId ? { ...c, replies: [...(c.replies ?? []), data.comment] } : c
            )
        );
    };

    const handleDelete = async (commentId: string) => {
        const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete comment");

        setComments((prev) =>
            prev
                .filter((c) => c._id !== commentId)
                .map((c) => ({
                    ...c,
                    replies: c.replies?.filter((r) => r._id !== commentId),
                }))
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {session?.user ? (
                <div className="flex flex-col gap-2">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t("placeholder")}
                        className="min-h-20"
                    />
                    <div>
                        <Button size="sm" className="cursor-pointer" onClick={handleSubmit} disabled={submitting || !content.trim()}>
                            {submitting ? t("submitting") : t("submit")}
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    {t("login_prompt")}{" "}
                    <Link href="/login" className="underline hover:no-underline">
                        {t("login_link")}
                    </Link>{" "}
                    {t("login_suffix")}
                </p>
            )}

            {loading ? (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="size-6 rounded-full shrink-0" />
                            <div className="flex-1 flex flex-col gap-2">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">{t("empty")}</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            currentUserId={session?.user?.id}
                            snippetAuthorId={snippetAuthorId}
                            onReplySubmit={handleReplySubmit}
                            onDelete={handleDelete}
                        />
                    ))}

                    {page < totalPages && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => fetchComments(page + 1, true)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? t("loading") : t("load_more")}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
