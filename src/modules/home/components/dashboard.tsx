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

export const Dashboard = () => {
    const router = useRouter();
    const [folderId, setFolderId] = useQueryState("folderId", parseAsString);
    const [tab, setTab] = useQueryState("tab", parseAsString);

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
        <div className="flex flex-1 min-h-0 bg-[#f9fbfd]">
            {/* Sidebar */}
            <div className="w-64 shrink-0 border-r border-slate-200/80 bg-white px-4 py-6 flex flex-col gap-6 print:hidden">
                {/* New button dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="lg"
                            className="w-40 justify-start gap-2 shadow-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            <Plus className="size-5" />
                            New
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44" align="start">
                        <DropdownMenuItem onClick={handleCreateDocument}>
                            <FilePlus className="size-4 mr-2 text-blue-500" />
                            New Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsCreateFolderOpen(true)}>
                            <FolderPlus className="size-4 mr-2 text-yellow-500" />
                            New Folder
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sidebar Navigation */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => {
                            setTab(null);
                            setFolderId(null);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer",
                            activeTab === "drive" &&
                                "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
                        )}
                    >
                        <Home className="size-4" />
                        My Drive
                    </button>
                    <button
                        onClick={() => {
                            setTab("starred");
                            setFolderId(null);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer",
                            activeTab === "starred" &&
                                "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
                        )}
                    >
                        <Star className="size-4" />
                        Starred
                    </button>
                </div>
            </div>

            {/* Main Content Dashboard */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto px-16 py-8 gap-6">
                <DndContext onDragEnd={handleDragEnd}>
                    {/* Header Path & Breadcrumbs */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 select-none">
                            <button
                                onClick={() => {
                                    setFolderId(null);
                                    setTab(null);
                                }}
                                className="hover:text-slate-900 cursor-pointer"
                            >
                                My Drive
                            </button>
                            {currentFolder && (
                                <>
                                    <ChevronRight className="size-4 text-slate-400" />
                                    <span className="text-slate-900 font-semibold truncate max-w-[200px]">
                                        {currentFolder.name}
                                    </span>
                                </>
                            )}
                            {activeTab === "starred" && (
                                <>
                                    <ChevronRight className="size-4 text-slate-400" />
                                    <span className="text-slate-900 font-semibold">Starred</span>
                                </>
                            )}
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

                    {/* Documents Table Section */}
                    <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800 text-base">
                                {activeTab === "starred" ? "Starred files" : "Files"}
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <DocumentsTable />
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
