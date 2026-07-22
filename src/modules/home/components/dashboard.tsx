"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import {
    Folder,
    Star,
    Plus,
    FolderPlus,
    FilePlus,
    ChevronRight,
    Home,
    ChevronsUpDown,
    Search,
    Users,
    Building2,
    Table,
    List,
    Filter,
    LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CreateFolderDialog } from "./create-folder-dialog";
import { FoldersGrid } from "./folders-grid";
import { DocumentsTable } from "./documents-table";
import { TemplateGallery } from "./template-gallery";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

import { motion } from "framer-motion";

import { Navbar } from "./navbar";

export const Dashboard = () => {
    const router = useRouter();
    const [folderId, setFolderId] = useQueryState("folderId", parseAsString);
    const [tab, setTab] = useQueryState("tab", parseAsString);
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    // Queries & Mutations
    const currentFolderId = folderId ? (folderId as Id<"folders">) : undefined;
    const currentFolder = useQuery(api.folders.get, {
        id: currentFolderId as Id<"folders">,
    });

    const createDocument = useMutation(api.documents.create);
    const moveToFolder = useMutation(api.documents.moveToFolder);

    const activeTab = tab || "drive";

    // Create document in current folder context
    const handleCreateDocument = async () => {
        try {
            const id = await createDocument({
                title: "Untitled document",
                folderId: currentFolderId,
            });
            toast.success("Document created");
            router.push(`/documents/${id}`);
        } catch (err) {
            toast.error("Failed to create document");
        }
    };

    // Drag-and-drop handler
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const docId = active.id as Id<"documents">;
        const targetFolderId = over.id as Id<"folders">;

        try {
            await moveToFolder({ id: docId, folderId: targetFolderId });
            toast.success("Document moved successfully");
        } catch (err) {
            toast.error("Failed to move document");
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f4f5f8] p-5 md:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                {/* Reduced Floating Navbar */}
                <div className="w-full">
                    <Navbar
                        onCreateDocument={handleCreateDocument}
                        onCreateFolder={() => setIsCreateFolderOpen(true)}
                    />
                </div>

                <DndContext onDragEnd={handleDragEnd}>
                    {/* Header Path & View Filter Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col gap-1"></div>

                        {/* Toolbar Controls: Cards/Table switcher, Starred filter, Filter dropdown */}
                        <div className="flex items-center gap-2.5">
                            {/* View Switcher Pill: Cards vs Table */}
                            <div className="relative flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
                                <button
                                    onClick={() => setViewMode("cards")}
                                    className={cn(
                                        "relative z-10 flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors duration-200 select-none active:scale-[0.97]",
                                        viewMode === "cards"
                                            ? "font-bold text-slate-900"
                                            : "text-slate-600 hover:text-slate-900",
                                    )}
                                >
                                    {viewMode === "cards" && (
                                        <motion.div
                                            layoutId="viewModePill"
                                            className="absolute inset-0 z-[-1] rounded-lg bg-white shadow-xs"
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 35,
                                                mass: 0.8,
                                            }}
                                        />
                                    )}
                                    <LayoutGrid className="size-3.5" />
                                    <span>Cards</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={cn(
                                        "relative z-10 flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors duration-200 select-none active:scale-[0.97]",
                                        viewMode === "table"
                                            ? "font-bold text-slate-900"
                                            : "text-slate-600 hover:text-slate-900",
                                    )}
                                >
                                    {viewMode === "table" && (
                                        <motion.div
                                            layoutId="viewModePill"
                                            className="absolute inset-0 z-[-1] rounded-lg bg-white shadow-xs"
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 35,
                                                mass: 0.8,
                                            }}
                                        />
                                    )}
                                    <Table className="size-3.5" />
                                    <span>Table</span>
                                </button>
                            </div>

                            {/* Starred Filter Option Toggle */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (activeTab === "starred") {
                                        setTab(null);
                                    } else {
                                        setTab("starred");
                                        setFolderId(null);
                                    }
                                }}
                                className={cn(
                                    "h-8 cursor-pointer gap-1.5 rounded-xl border border-dashed text-xs font-semibold transition-all active:scale-[0.98]",
                                    activeTab === "starred"
                                        ? "border-amber-300 bg-amber-50 text-amber-800 shadow-xs hover:bg-amber-100"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                                )}
                            >
                                <Star
                                    className={cn(
                                        "size-3.5",
                                        activeTab === "starred"
                                            ? "fill-amber-500 text-amber-500"
                                            : "text-slate-500",
                                    )}
                                />
                                <span>Starred</span>
                            </Button>

                            {/* Filter Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 cursor-pointer gap-1.5 rounded-xl border-dashed border-slate-300 bg-white text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
                                    >
                                        <Filter className="size-3.5 text-slate-500" />
                                        <span>Filter</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                >
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setTab(null);
                                            setFolderId(null);
                                        }}
                                        className="cursor-pointer font-medium text-slate-700"
                                    >
                                        All Files
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setTab("starred");
                                            setFolderId(null);
                                        }}
                                        className="cursor-pointer font-medium text-slate-700"
                                    >
                                        <Star className="mr-2 size-3.5 fill-amber-500 text-amber-500" />
                                        Starred Only
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Template Gallery Section (Only show at root of My Drive) */}
                    {activeTab === "drive" && !currentFolderId && (
                        <TemplateGallery />
                    )}

                    {/* Folders Section (Hide if in Starred view) */}
                    {activeTab !== "starred" && (
                        <FoldersGrid
                            parentFolderId={currentFolderId}
                            onFolderClick={(id) => setFolderId(id)}
                        />
                    )}

                    {/* Documents Table / Cards Section (At the bottom of dashboard) */}
                    <div className="flex w-full flex-col rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-600"></span>
                                <h3 className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
                                    {activeTab === "starred"
                                        ? "Starred files"
                                        : "Files"}
                                </h3>
                            </div>
                            <span className="text-xs font-medium text-slate-400">
                                Drag to move items
                            </span>
                        </div>
                        <div className="w-full">
                            <DocumentsTable viewMode={viewMode} />
                        </div>
                    </div>
                </DndContext>
            </div>

            {/* Folder creation Dialog */}
            <CreateFolderDialog
                open={isCreateFolderOpen}
                onOpenChange={setIsCreateFolderOpen}
                parentFolderId={currentFolderId}
            />
        </div>
    );
};
