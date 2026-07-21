"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, MoreVertical, Edit2, Trash, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Id } from "../../../../convex/_generated/dataModel";

type Tab = {
    id: string;
    title: string;
    roomId: string;
};

type Props = {
    documentId: Id<"documents">;
    tabs: Tab[];
    activeTabId: string;
    onSelectTab: (roomId: string) => void;
    isOpen: boolean;
    onToggle: () => void;
};

export const TabsPanel = ({
    documentId,
    tabs,
    activeTabId,
    onSelectTab,
    isOpen,
    onToggle,
}: Props) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTabTitle, setNewTabTitle] = useState("");

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [selectedTabId, setSelectedTabId] = useState("");

    const addTab = useMutation(api.documents.addTab);
    const renameTab = useMutation(api.documents.renameTab);
    const removeTab = useMutation(api.documents.removeTab);

    const handleCreateTab = async () => {
        const title = newTabTitle.trim() || `Tab ${tabs.length + 1}`;
        const randomId = Math.random().toString(36).substring(7);
        const roomId = `${documentId}-tab-${randomId}`;

        try {
            await addTab({ id: documentId, title, roomId });
            setIsCreateOpen(false);
            setNewTabTitle("");
            onSelectTab(roomId);
            toast.success("Tab added successfully");
        } catch (err) {
            toast.error("Failed to add tab");
        }
    };

    const handleRenameTab = async () => {
        if (!renameValue.trim()) return;
        try {
            await renameTab({ id: documentId, tabId: selectedTabId, title: renameValue.trim() });
            setIsRenameOpen(false);
            toast.success("Tab renamed successfully");
        } catch (err) {
            toast.error("Failed to rename tab");
        }
    };

    const handleDeleteTab = async (tabId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (tabs.length <= 1) {
            toast.error("A document must have at least one tab");
            return;
        }

        try {
            await removeTab({ id: documentId, tabId });
            toast.success("Tab deleted successfully");
            
            // If deleting active tab, switch to another tab
            if (activeTabId === tabId) {
                const remainingTabs = tabs.filter(t => t.id !== tabId);
                if (remainingTabs.length > 0) {
                    onSelectTab(remainingTabs[0].roomId);
                }
            }
        } catch (err) {
            toast.error("Failed to delete tab");
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-l-0 border-slate-200 p-1.5 rounded-r-md shadow-md transition hover:bg-slate-50 cursor-pointer flex items-center justify-center print:hidden"
                title="Show tabs"
            >
                <ChevronRight className="size-4 text-slate-500" />
            </button>
        );
    }

    return (
        <>
            <div className="w-60 shrink-0 border-r border-slate-200/80 bg-white p-4 flex flex-col gap-4 select-none relative h-full print:hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="size-3.5" />
                        Document Tabs
                    </span>
                    <button
                        onClick={onToggle}
                        className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer"
                        title="Hide tabs"
                    >
                        <ChevronLeft className="size-4 text-slate-500" />
                    </button>
                </div>

                {/* Add Tab Button */}
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 border-slate-200 hover:border-slate-300 font-medium text-xs text-slate-600 hover:bg-slate-50"
                >
                    <Plus className="size-4" />
                    Add Tab
                </Button>

                {/* Tabs List */}
                <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => onSelectTab(tab.roomId)}
                            className={cn(
                                "group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition cursor-pointer",
                                activeTabId === tab.roomId && "bg-blue-50/70 text-blue-700 font-medium",
                            )}
                        >
                            <span className="truncate flex-1 text-left">
                                {tab.title}
                            </span>

                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 transition"
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 hover:bg-slate-200/60 rounded-md transition">
                                            <MoreVertical className="size-3.5 text-slate-500" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedTabId(tab.id);
                                            setRenameValue(tab.title);
                                            setIsRenameOpen(true);
                                        }}>
                                            <Edit2 className="size-3.5 mr-2" />
                                            Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => handleDeleteTab(tab.id, e)}
                                            className="text-destructive focus:text-destructive"
                                            disabled={tabs.length <= 1}
                                        >
                                            <Trash className="size-3.5 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Tab Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Tab</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateTab();
                        }}
                        className="space-y-4"
                    >
                        <Input
                            placeholder="Tab name (e.g. Sub-document 1)"
                            value={newTabTitle}
                            onChange={(e) => setNewTabTitle(e.target.value)}
                            autoFocus
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Rename Tab Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Tab</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRenameTab();
                        }}
                        className="space-y-4"
                    >
                        <Input
                            placeholder="Tab name"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
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
