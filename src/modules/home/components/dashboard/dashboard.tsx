"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { useState } from "react";
import { CreateFolderDialog } from "../dialogs/create-folder-dialog";
import { FoldersGrid } from "../folders/folders-grid";
import { DocumentsTable } from "../documents/documents-table";
import { TemplateGallery } from "../templates/template-gallery";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Navbar } from "./navbar";
import { DashboardToolbar } from "./dashboard-toolbar";

export const Dashboard = () => {
    const router = useRouter();
    const [folderId, setFolderId] = useQueryState("folderId", parseAsString);
    const [tab, setTab] = useQueryState("tab", parseAsString);
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    const currentFolderId = folderId ? (folderId as Id<"folders">) : undefined;
    const createDocument = useMutation(api.documents.create);
    const activeTab = tab || "drive";

    const handleCreateDocument = async () => {
        try {
            const id = await createDocument({
                title: "Untitled document",
                folderId: currentFolderId,
            });
            toast.success("Document created");
            router.push(`/documents/${id}`);
        } catch {
            toast.error("Failed to create document");
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f4f5f8] p-5 md:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="w-full">
                    <Navbar
                        onCreateDocument={handleCreateDocument}
                        onCreateFolder={() => setIsCreateFolderOpen(true)}
                    />
                </div>

                <DashboardToolbar
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    activeTab={activeTab}
                    setTab={setTab}
                    setFolderId={setFolderId}
                />

                {activeTab === "drive" && !currentFolderId && (
                    <TemplateGallery />
                )}

                {activeTab !== "starred" && (
                    <FoldersGrid
                        parentFolderId={currentFolderId}
                        onFolderClick={(id) => setFolderId(id)}
                    />
                )}

                <div className="flex w-full flex-col rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-600" />
                            <h3 className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
                                {activeTab === "starred" ? "Starred files" : "Files"}
                            </h3>
                        </div>
                    </div>
                    <div className="w-full">
                        <DocumentsTable viewMode={viewMode} />
                    </div>
                </div>
            </div>

            <CreateFolderDialog
                open={isCreateFolderOpen}
                onOpenChange={setIsCreateFolderOpen}
                parentFolderId={currentFolderId}
            />
        </div>
    );
};
