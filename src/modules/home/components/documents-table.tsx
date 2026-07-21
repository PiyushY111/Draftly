"use client";

import { usePaginatedQuery, UsePaginatedQueryResult } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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
import { Doc } from "../../../../convex/_generated/dataModel";
import { DocumentRow } from "./document-row";

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
type Props = Pick<T, "results" | "status">;

const DocumentsTableContent = ({ results, status }: Props) => {
    if (status === "LoadingFirstPage") {
        return <DocumentTableSkeleton />;
    }

    if (results.length === 0) {
        return (
            <TableBody>
                <TableRow className="hover:bg-transparent">
                    <TableCell
                        colSpan={4}
                        className="text-muted-foreground h-24 text-center"
                    >
                        No documents found
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    return (
        <TableBody>
            {results.map((document) => (
                <DocumentRow key={document._id} document={document} />
            ))}
        </TableBody>
    );
};

import { useQueryState, parseAsString } from "nuqs";
import { Id } from "../../../../convex/_generated/dataModel";

export function DocumentsTable() {
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
        },
        { initialNumItems: 5 },
    );

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-16 py-6">
            <Table>
                <TableHeader>
                    <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="w-[30px]">&nbsp;</TableHead>
                        <TableHead className="w-[50px]">&nbsp;</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                            Shared
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Create at
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <DocumentsTableContent results={results} status={status} />
            </Table>
            <div
                className={cn(
                    "flex items-center justify-center",
                    (status === "Exhausted" || status === "LoadingFirstPage") &&
                        "hidden",
                )}
            >
                <Button
                    variant="secondary"
                    onClick={() => loadMore(5)}
                    disabled={isLoading}
                >
                    {status === "LoadingMore" ? (
                        <>
                            <Loader className="text-muted-foreground animate-spin" />
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
