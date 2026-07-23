"use client";
import { Button } from "@/components/ui";


import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useQueryState, parseAsString } from "nuqs";
import { useUser } from "@clerk/nextjs";
import { useSearchParam } from "@/hooks/use-search-param";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DocumentsTableContent } from "./documents-table-content";

export function DocumentsTable({ viewMode = "cards" }: { viewMode?: "table" | "cards" }) {
    const { user } = useUser();
    const [search] = useSearchParam();
    const [folderId] = useQueryState("folderId", parseAsString);
    const [tab] = useQueryState("tab", parseAsString);
    const onlyStarred = tab === "starred";

    const { results, status, isLoading, loadMore } = usePaginatedQuery(
        api.documents.list,
        {
            search,
            folderId: folderId ? (folderId as Id<"folders">) : undefined,
            onlyStarred: onlyStarred || undefined,
            userEmail: user?.primaryEmailAddress?.emailAddress || undefined,
        },
        { initialNumItems: 8 },
    );

    return (
        <div className="flex w-full flex-col gap-3">
            <DocumentsTableContent results={results} status={status} viewMode={viewMode} />
            <div
                className={cn(
                    "flex items-center justify-center pb-4 pt-1",
                    (status === "Exhausted" || status === "LoadingFirstPage") && "hidden",
                )}
            >
                <Button
                    variant="secondary"
                    size="sm"
                    className="border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl active:scale-95 transition-all"
                    onClick={() => loadMore(8)}
                    disabled={isLoading}
                >
                    {status === "LoadingMore" ? (
                        <>
                            <Loader className="text-muted-foreground animate-spin size-3.5" />
                            Loading...
                        </>
                    ) : (
                        "Load more"
                    )}
                </Button>
            </div>
        </div>
    );
}
