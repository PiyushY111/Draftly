"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { History, X, Plus, Calendar, User, CornerUpLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Editor } from "@tiptap/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type Props = {
    documentId: Id<"documents">;
    editor: Editor | null;
    onEnterTimeTravel: (content: string, revisionId: Id<"revisions">) => void;
    onExitTimeTravel: () => void;
    isTimeTraveling: boolean;
    activeRevisionId?: Id<"revisions"> | null;
    isOpen: boolean;
    onClose: () => void;
};

export const RevisionsSidebar = ({
    documentId,
    editor,
    onEnterTimeTravel,
    onExitTimeTravel,
    isTimeTraveling,
    activeRevisionId,
    isOpen,
    onClose,
}: Props) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [versionName, setVersionName] = useState("");

    const revisions = useQuery(api.documents.getRevisions, { documentId });
    const createRevision = useMutation(api.documents.createRevision);
    const restoreRevision = useMutation(api.documents.restoreRevision);

    const handleSaveVersion = async () => {
        if (!editor) return;
        const name = versionName.trim() || `Version ${format(new Date(), "MMM d, h:mm a")}`;
        const content = editor.getHTML();

        try {
            await createRevision({
                documentId,
                content,
                title: name,
            });
            setIsCreateOpen(false);
            setVersionName("");
            toast.success("Version saved successfully");
        } catch (err) {
            toast.error("Failed to save version");
        }
    };

    const handleRestore = async (revisionId: Id<"revisions">) => {
        try {
            await restoreRevision({ documentId, revisionId });
            
            // Set the restored content in the editor collaboratively
            const rev = revisions?.find(r => r._id === revisionId);
            if (rev && editor) {
                editor.commands.setContent(rev.content);
            }
            
            onExitTimeTravel();
            toast.success("Version restored successfully");
        } catch (err) {
            toast.error("Failed to restore version");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="w-80 shrink-0 border-l border-slate-200/80 bg-white p-4 flex flex-col gap-4 select-none relative h-full print:hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <History className="size-4" />
                        Version History
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer"
                    >
                        <X className="size-4 text-slate-500" />
                    </button>
                </div>

                {/* Save Current State Button */}
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    disabled={isTimeTraveling}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 border-slate-200 hover:border-slate-300 font-medium text-xs text-slate-600 hover:bg-slate-50"
                >
                    <Plus className="size-4" />
                    Save Named Version
                </Button>

                {/* Revisions Timeline List */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    {revisions?.map((revision) => (
                        <div
                            key={revision._id}
                            onClick={() => onEnterTimeTravel(revision.content, revision._id)}
                            className={cn(
                                "flex flex-col gap-1.5 p-3 border rounded-xl shadow-sm transition hover:shadow-md cursor-pointer text-left",
                                activeRevisionId === revision._id
                                    ? "border-blue-500 bg-blue-50/30"
                                    : "border-slate-100 hover:border-slate-200 bg-white",
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-sm text-slate-700 truncate">
                                    {revision.title}
                                </span>
                                {isTimeTraveling && activeRevisionId === revision._id && (
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRestore(revision._id);
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-2 text-[10px] gap-1 font-bold border-blue-200 hover:bg-blue-600 hover:text-white"
                                    >
                                        <CornerUpLeft className="size-3" />
                                        Restore
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {format(revision.createdAt, "MMM d, yyyy h:mm a")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="size-3" />
                                    By {revision.createdByName}
                                </span>
                            </div>
                        </div>
                    ))}
                    {(!revisions || revisions.length === 0) && (
                        <div className="text-center text-xs text-slate-400 mt-8">
                            No saved versions yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Name Version Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Current Version</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveVersion();
                        }}
                        className="space-y-4"
                    >
                        <Input
                            placeholder="Version name (e.g. Draft v1)"
                            value={versionName}
                            onChange={(e) => setVersionName(e.target.value)}
                            autoFocus
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
