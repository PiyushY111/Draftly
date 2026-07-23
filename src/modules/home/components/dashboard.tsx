"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import {
    Folder,
    Star,
    Table,
    Filter,
    LayoutGrid,
    FolderPlus,
    FilePlus,
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
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { motion } from "framer-motion";

export const Dashboard = () => {
    const router = useRouter();
    const [folderId, setFolderId] = useQueryState("folderId", parseAsString);
    const [tab, setTab] = useQueryState("tab", parseAsString);
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    // Queries & Mutations
    const currentFolderId = folderId ? (folderId as Id<"folders">) : undefined;

    const createDocument = useMutation(api.documents.create);

    const activeTab = tab || "home";

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

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f4f5f8]">
            {/* Left Sidebar */}
            <div className="hidden md:flex h-full">
                <Sidebar onCreateFolder={() => setIsCreateFolderOpen(true)} />
            </div>

            {/* Right Main Content Area */}
            <main className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 gap-6">
                {/* Top Navbar */}
                <Navbar
                    onCreateDocument={handleCreateDocument}
                    onCreateFolder={() => setIsCreateFolderOpen(true)}
                />

                {/* Toolbar Controls (Cards / Table Switcher, Starred, Filter) */}
                <div className="flex items-center justify-between gap-4 pt-1">
                    <div></div>

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
                                        className="absolute inset-0 z-[-1] rounded-lg bg-white shadow-2xs"
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
                                        className="absolute inset-0 z-[-1] rounded-lg bg-white shadow-2xs"
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
                                "h-8 cursor-pointer gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold transition-all active:scale-[0.98]",
                                activeTab === "starred"
                                    ? "border-amber-300 bg-amber-50 text-amber-800 shadow-2xs hover:bg-amber-100"
                                    : "text-slate-700 hover:bg-slate-50",
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
                                    className="h-8 cursor-pointer gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
                                >
                                    <Filter className="size-3.5 text-slate-500" />
                                    <span>Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
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

                {/* Template Gallery Section (Only show at root) */}
                {(activeTab === "home" || activeTab === "drive") && !currentFolderId && (
                    <TemplateGallery />
                )}

                {/* Folders Section (Hide if in Starred view) */}
                {activeTab !== "starred" && (
                    <FoldersGrid
                        parentFolderId={currentFolderId}
                        onFolderClick={(id) => setFolderId(id)}
                    />
                )}

                {/* Files Section Container */}
                <div className="flex w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Folder className="size-4 text-indigo-600 fill-indigo-100" />
                            <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
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
            </main>

            {/* Folder creation Dialog */}
            <CreateFolderDialog
                open={isCreateFolderOpen}
                onOpenChange={setIsCreateFolderOpen}
                parentFolderId={currentFolderId}
            />
        </div>
    );
};
