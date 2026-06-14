import { Skeleton } from "@/components/ui/skeleton";

interface SnippetCardSkeletonProps {
    avatar?: boolean;
    likes?: boolean;
}

export default function SnippetCardSkeleton({ avatar = false, likes = false }: SnippetCardSkeletonProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 md:p-4 border rounded-sm bg-background">
            <div className="flex flex-col gap-1 flex-1 w-full">

                <div className="flex items-center gap-2">
                    {avatar && (
                        <Skeleton className="h-8 w-8 rounded-full" />
                    )}

                    <Skeleton className="h-5 md:h-6 w-48 md:w-72" />

                    <Skeleton className="hidden md:block h-6 w-20" />
                </div>

                <div className="flex flex-col items-start w-full gap-3 md:gap-2 mt-1">

                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 w-full">
                        <Skeleton className="h-6 w-20 md:hidden" />

                        <div className="flex gap-3 md:gap-4 items-center">
                            {likes && (
                                <Skeleton className="h-4 w-16" />
                            )}
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-2 ml-4">
                <Skeleton className="h-9 w-20 rounded-md" />
            </div>
        </div>
    );
}