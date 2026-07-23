"use client";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, Input } from "@/components/ui";


import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { History, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Editor } from "@tiptap/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { RevisionItem } from "../revisions/revision-item";

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
    documentId, editor, onEnterTimeTravel, onExitTimeTravel, isTimeTraveling, activeRevisionId, isOpen, onClose,
}: Props) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [versionName, setVersionName] = useState("");

    const revisions = useQuery(api.documents.getRevisions, { documentId });
    const createRevision = useMutation(api.documents.createRevision);
    const restoreRevision = useMutation(api.documents.restoreRevision);

    const handleSaveVersion = async () => {
        if (!editor) return;
        const name = versionName.trim() || `Version ${format(new Date(), "MMM d, h:mm a")}`;
        try {
            await createRevision({ documentId, content: editor.getHTML(), title: name });
            setIsCreateOpen(false);
            setVersionName("");
            toast.success("Version saved successfully");
        } catch { toast.error("Failed to save version"); }
    };

    const handleRestore = async (revisionId: Id<"revisions">) => {
        try {
            await restoreRevision({ documentId, revisionId });
            const rev = revisions?.find(r => r._id === revisionId);
            if (rev && editor) editor.commands.setContent(rev.content);
            onExitTimeTravel();
            toast.success("Version restored successfully");
        } catch { toast.error("Failed to restore version"); }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="w-80 shrink-0 border-l border-slate-200/80 bg-white p-4 flex flex-col gap-4 select-none relative h-full print:hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <History className="size-4" /> Version History
                    </span>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer">
                        <X className="size-4 text-slate-500" />
                    </button>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} disabled={isTimeTraveling} variant="outline" size="sm" className="w-full justify-start gap-2 border-slate-200 hover:border-slate-300 font-medium text-xs text-slate-600 hover:bg-slate-50">
                    <Plus className="size-4" /> Save Named Version
                </Button>
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    {revisions?.map((revision) => (
                        <RevisionItem
                            key={revision._id}
                            revision={revision}
                            isActive={activeRevisionId === revision._id}
                            isTimeTraveling={isTimeTraveling}
                            onClick={() => onEnterTimeTravel(revision.content, revision._id)}
                            onRestore={() => handleRestore(revision._id)}
                        />
                    ))}
                    {(!revisions || revisions.length === 0) && (
                        <div className="text-center text-xs text-slate-400 mt-8">No saved versions yet.</div>
                    )}
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Save Current Version</DialogTitle></DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveVersion(); }} className="space-y-4">
                        <Input placeholder="Version name (e.g. Draft v1)" value={versionName} onChange={(e) => setVersionName(e.target.value)} autoFocus />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
