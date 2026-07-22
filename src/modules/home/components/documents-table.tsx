"use client";

import { usePaginatedQuery, UsePaginatedQueryResult } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryState, parseAsString } from "nuqs";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useSearchParam } from "@/hooks/use-search-param";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { DocumentCard } from "./document-card";
import { DocumentRow } from "./document-row";

const DocumentCardsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-2xl" />
            ))}
        </div>
    );
};

const DocumentTableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                    <TableCell colSpan={4}>
                        <Skeleton className="h-8" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

type T = UsePaginatedQueryResult<Doc<"documents">>;
type Props = Pick<T, "results" | "status"> & { viewMode?: "table" | "cards" };

const DocumentsTableContent = ({ results, status, viewMode = "cards" }: Props) => {
    if (status === "LoadingFirstPage") {
        return viewMode === "cards" ? <DocumentCardsSkeleton /> : <DocumentTableSkeleton />;
    }

    if (results.length === 0) {
        return (
            <div className="flex h-36 w-full items-center justify-center text-sm font-medium text-slate-400">
                No documents found
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            {viewMode === "cards" ? (
                <motion.div
                    key="cards-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5"
                >
                    {results.map((document) => (
                        <DocumentCard key={document._id} document={document} />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    key="table-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                <TableHead className="w-[30px]">&nbsp;</TableHead>
                                <TableHead className="w-[40px]">&nbsp;</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Name</TableHead>
                                <TableHead className="hidden md:table-cell font-bold text-xs uppercase tracking-wider text-slate-500">
                                    Owner
                                </TableHead>
                                <TableHead className="hidden md:table-cell font-bold text-xs uppercase tracking-wider text-slate-500">
                                    Created at
                                </TableHead>
                                <TableHead className="w-[50px] text-right">&nbsp;</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.map((document) => (
                                <DocumentRow key={document._id} document={document} />
                            ))}
                        </TableBody>
                    </Table>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

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
                    (status === "Exhausted" || status === "LoadingFirstPage") &&
                        "hidden",
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
