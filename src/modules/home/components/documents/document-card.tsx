"use client";

import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { FileText, Star, Clock, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { DocumentMenu } from "../dialogs/document-menu";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
    document: Doc<"documents">;
};

export const DocumentCard = ({ document }: Props) => {
    const router = useRouter();
    const { userId, orgRole } = useAuth();
    const toggleStar = useMutation(api.documents.toggleStar);

    const onClick = () => {
        router.push(`/documents/${document._id}`);
    };

    const handleStarClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleStar({ id: document._id });
            toast.success(document.isStarred ? "Document unstarred" : "Document starred");
        } catch (err) {
            toast.error("Failed to star document");
        }
    };

    const canRemove = userId === document.ownerId || orgRole === "org:admin";
    const isOwner = userId === document.ownerId;

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md cursor-pointer select-none active:scale-[0.985]"
        >
            {/* Top Dotted / Skeleton Container Header */}
            <div
                className="relative flex h-32 w-full flex-col justify-between overflow-hidden rounded-xl bg-slate-50/90 p-3 transition-colors duration-300 group-hover:bg-indigo-50/30"
                style={{
                    backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`,
                    backgroundSize: "12px 12px",
                }}
            >
                {/* Top Overlay Badge & Action Icons */}
                <div
                    className="relative z-10 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-200/80 bg-indigo-50/90 px-2 py-0.5 text-[10px] font-bold text-indigo-700 shadow-2xs backdrop-blur-xs">
                            <FileText className="size-3 text-indigo-600" />
                            Doc
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleStarClick}
                            className="flex items-center justify-center rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-2xs backdrop-blur-xs transition hover:bg-slate-100 cursor-pointer"
                        >
                            <Star
                                className={cn(
                                    "size-3.5 text-slate-400 hover:text-amber-400 hover:fill-amber-400 transition-colors",
                                    document.isStarred && "text-amber-400 fill-amber-400",
                                )}
                            />
                        </button>
                        <div className="rounded-full border border-slate-200/80 bg-white/90 p-0.5 shadow-2xs backdrop-blur-xs">
                            <DocumentMenu
                                id={document._id}
                                title={document.title}
                                canRemove={canRemove}
                            />
                        </div>
                    </div>
                </div>

                {/* Form / Document Skeleton Overview Card */}
                <div className="flex flex-1 items-center justify-center py-1">
                    <div className="relative flex h-16 w-28 flex-col gap-1.5 rounded-lg border border-slate-200/90 bg-white p-2 shadow-2xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-indigo-300 group-hover:shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <div className="h-1.5 w-10 rounded-full bg-indigo-500/80" />
                            <div className="size-1.5 rounded-full bg-slate-300" />
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200/70" />
                        <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>

            {/* Bottom Info Section */}
            <div className="flex flex-col gap-1.5 pt-3">
                <h4 className="truncate text-xs font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                    {document.title || "Untitled document"}
                </h4>
                <p className="truncate text-[11px] font-medium text-slate-400">
                    Click to open and edit document...
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-medium text-slate-400">
                    <div className="flex items-center gap-1">
                        <UserCheck className="size-3 text-slate-400" />
                        <span className="text-slate-500 font-semibold">
                            {isOwner ? "@ me" : "@ Shared"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="size-3 text-slate-400" />
                        <span>
                            {format(new Date(document._creationTime), "MMM d, yyyy")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
