"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";

type Props = {
    documentId: Id<"documents">;
    sharedEmails: string[];
    isOwner: boolean;
};

export const SharedCollaboratorsList = ({ documentId, sharedEmails, isOwner }: Props) => {
    const unshare = useMutation(api.documents.unshare);

    const handleUnshare = async (targetEmail: string) => {
        try {
            await unshare({ id: documentId, email: targetEmail });
            toast.success(`Removed access for ${targetEmail}`);
        } catch {
            toast.error("Failed to revoke access");
        }
    };

    return (
        <div className="mt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                People with access
            </h4>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {/* Owner item */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-700 truncate">
                            {isOwner ? "You" : "Document Owner"}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                            Owner
                        </span>
                    </div>
                </div>

                {/* Shared list items */}
                {sharedEmails.map((sharedEmail) => (
                    <div
                        key={sharedEmail}
                        className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl text-sm hover:bg-slate-50 transition"
                    >
                        <span className="font-medium text-slate-600 truncate mr-2">
                            {sharedEmail}
                        </span>
                        {isOwner && (
                            <button
                                onClick={() => handleUnshare(sharedEmail)}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition cursor-pointer"
                                title="Revoke access"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        )}
                    </div>
                ))}

                {sharedEmails.length === 0 && (
                    <div className="text-center text-xs text-slate-400 py-4 select-none">
                        Document is private. Shared with no one.
                    </div>
                )}
            </div>
        </div>
    );
};
