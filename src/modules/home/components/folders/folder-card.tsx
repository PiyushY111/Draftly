"use client";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, Input } from "@/components/ui";


import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Folder, MoreVertical, Trash2, Edit3 } from "lucide-react";
import { handleError } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";

type FolderItem = {
    _id: Id<"folders">;
    name: string;
    parentFolderId?: Id<"folders">;
};

export const FolderCard = ({
    folder,
    onClick,
}: {
    folder: FolderItem;
    onClick: () => void;
}) => {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameValue, setRenameValue] = useState(folder.name);

    const deleteFolder = useMutation(api.folders.remove);
    const renameFolder = useMutation(api.folders.rename);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteFolder({ id: folder._id });
            toast.success("Folder and its contents deleted");
        } catch (err) {
            handleError(err as Error);
        }
    };

    const handleRename = async () => {
        if (!renameValue.trim()) return;
        try {
            await renameFolder({ id: folder._id, name: renameValue.trim() });
            setIsRenameOpen(false);
            toast.success("Folder renamed successfully");
        } catch (err) {
            handleError(err as Error);
        }
    };

    return (
        <>
            <div
                onClick={onClick}
                className="relative flex items-center justify-between gap-3 px-4 py-3 bg-white border border-dashed border-slate-300 rounded-xl shadow-none transition-all duration-200 hover:border-blue-500 hover:shadow-sm cursor-pointer select-none"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <Folder className="size-5 text-blue-600 fill-blue-600/10 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                        {folder.name}
                    </span>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 rounded-full">
                                <MoreVertical className="size-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                                <Edit3 className="size-4 mr-2" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                <Trash2 className="size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Folder</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRename();
                        }}
                        className="space-y-4"
                    >
                        <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            placeholder="Folder name"
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
