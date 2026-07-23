"use client";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui";


import { motion, AnimatePresence } from "framer-motion";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { DocumentCard } from "./document-card";
import { DocumentRow } from "./document-row";
import { DocumentCardsSkeleton, DocumentTableSkeleton } from "./documents-skeletons";

type Props = {
    results: Doc<"documents">[];
    status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
    viewMode: "table" | "cards";
};

export const DocumentsTableContent = ({ results, status, viewMode }: Props) => {
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
