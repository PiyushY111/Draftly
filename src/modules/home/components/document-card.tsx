"use client";

import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { Building2, CircleUser, FileText, Star, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Doc } from "../../../../convex/_generated/dataModel";
import { DocumentMenu } from "./document-menu";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
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

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md cursor-pointer select-none active:scale-[0.985]"
        >
            {/* Top Dotted Pattern Header with Miniature Form/Document Overview */}
            <div
                className="relative flex h-36 w-full flex-col justify-between overflow-hidden bg-slate-50/90 p-3 transition-colors duration-300 group-hover:bg-blue-50/30"
                style={{
                    backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`,
                    backgroundSize: "14px 14px",
                }}
            >
                {/* Top overlay control items */}
                <div
                    className="relative z-10 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-blue-200/80 bg-blue-50/90 px-2 py-0.5 text-[10px] font-bold text-blue-700 shadow-xs backdrop-blur-xs">
                            <FileText className="size-3 text-blue-600" />
                            Doc
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleStarClick}
                            className="flex items-center justify-center rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-xs backdrop-blur-xs transition hover:bg-slate-100"
                        >
                            <Star
                                className={cn(
                                    "size-3.5 text-slate-400 hover:text-amber-400 hover:fill-amber-400 transition-colors",
                                    document.isStarred && "text-amber-400 fill-amber-400",
                                )}
                            />
                        </button>
                        <div className="rounded-full border border-slate-200/80 bg-white/90 p-0.5 shadow-xs backdrop-blur-xs">
                            <DocumentMenu
                                id={document._id}
                                title={document.title}
                                canRemove={canRemove}
                            />
                        </div>
                    </div>
                </div>

                {/* Form / Document Miniature Overview Box */}
                <div className="flex flex-1 items-center justify-center py-1">
                    <div className="relative flex h-20 w-32 flex-col gap-1.5 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-blue-300 group-hover:shadow-sm">
                        {/* Mini Header Line */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <div className="h-1.5 w-12 rounded-full bg-blue-500/80" />
                            <div className="size-1.5 rounded-full bg-slate-300" />
                        </div>
                        {/* Mini Content / Form Skeleton Lines */}
                        <div className="h-1.5 w-full rounded-full bg-slate-200/70" />
                        <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
                        <div className="mt-auto flex items-center justify-between pt-0.5">
                            <div className="h-1.5 w-6 rounded-full bg-blue-100" />
                            <div className="h-1.5 w-3 rounded-full bg-slate-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body Footer */}
            <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-1">
                    <h4 className="line-clamp-1 font-bold text-sm text-slate-900 tracking-tight transition-colors group-hover:text-blue-600">
                        {document.title}
                    </h4>
                    <p className="line-clamp-1 text-xs text-slate-500 font-normal">
                        Click to open and edit document...
                    </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                        {userId === document.ownerId ? (
                            <>
                                <CircleUser className="size-3.5 text-slate-400" />
                                <span className="font-semibold text-slate-700">me</span>
                            </>
                        ) : document.organizationId ? (
                            <>
                                <Building2 className="size-3.5 text-slate-400" />
                                <span>Org</span>
                            </>
                        ) : (
                            <>
                                <CircleUser className="size-3.5 text-blue-500" />
                                <span className="font-semibold text-blue-600">Shared</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="size-3" />
                        <span>{format(document._creationTime, "MMM d, yyyy")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
