"use client";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui";


import { ConfirmDialog } from "@/components/confirm-dialog";
import { handleError } from "@/lib/utils";
import { RenameDialog } from "@/modules/home/components/dialogs/rename-dialog";
import { useEditorStore } from "@/providers/editor-store-provider";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
    Download,
    FileJson,
    FilePen,
    FilePlus,
    FileText,
    FileType,
    Globe,
    History,
    Printer,
    Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

type Props = {
    id: Id<"documents">;
    title: string;
    onToggleRevisions?: () => void;
};

export const FileMenu = ({ id, title, onToggleRevisions }: Props) => {
    const { editor } = useEditorStore((state) => state);
    const router = useRouter();

    const create = useMutation({
        mutationFn: useConvexMutation(api.documents.create),
    });

    const onCreateDocument = () => {
        create.mutate(
            { title: "Untitled Document", initialContent: "" },
            {
                onError(error) {
                    handleError(error);
                },
                onSuccess(id) {
                    router.push(`/documents/${id}`);
                },
            },
        );
    };

    const [openRename, setOpenRename] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const remove = useMutation({
        mutationFn: useConvexMutation(api.documents.remove),
    });

    const onRemoveDocument = () => {
        remove.mutate(
            { id },
            {
                onError(error) {
                    handleError(error);
                },
                onSuccess() {
                    window.location.href = "/";
                },
            },
        );
    };

    const onDownload = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const onSaveJSON = () => {
        if (!editor) return;
        const content = editor.getJSON();
        const blob = new Blob([JSON.stringify(content)], {
            type: "application/json",
        });
        onDownload(blob, `${title}.json`);
    };

    const onSaveHTML = () => {
        if (!editor) return;
        const content = editor.getHTML();
        const blob = new Blob([content], { type: "text/html" });
        onDownload(blob, `${title}.html`);
    };

    const onSaveText = () => {
        if (!editor) return;
        const content = editor.getText();
        const blob = new Blob([content], { type: "text/plain" });
        onDownload(blob, `${title}.txt`);
    };

    return (
        <>
            <RenameDialog
                documentId={id}
                open={openRename}
                onOpenChange={setOpenRename}
                title={title}
            />
            <ConfirmDialog
                title={`Remove "${title}"`}
                message="Are you sure you want to remove this document?"
                open={openConfirm}
                onOpenChange={setOpenConfirm}
                disabled={remove.isPending}
                onConfirm={onRemoveDocument}
            />
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent className="print:hidden">
                    <MenubarItem
                        onClick={onCreateDocument}
                        disabled={create.isPending}
                    >
                        <FilePlus className="size-4 mr-2" />
                        New Document
                    </MenubarItem>
                    <MenubarItem
                        onClick={() => setOpenRename(true)}
                    >
                        <FilePen className="size-4 mr-2" />
                        Rename
                    </MenubarItem>
                    <MenubarItem
                        onClick={() => setOpenConfirm(true)}
                    >
                        <Trash className="size-4 mr-2" />
                        Remove
                    </MenubarItem>
                    {onToggleRevisions && (
                        <MenubarItem
                            onClick={onToggleRevisions}
                        >
                            <History className="size-4 mr-2" />
                            Version History
                        </MenubarItem>
                    )}
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>
                            <Download className="size-4 mr-2" />
                            Export
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem
                                onClick={onSaveJSON}
                            >
                                <FileJson className="size-4 mr-2" />
                                JSON
                            </MenubarItem>
                            <MenubarItem
                                onClick={onSaveHTML}
                            >
                                <Globe className="size-4 mr-2" />
                                HTML
                            </MenubarItem>
                            <MenubarItem
                                onClick={() =>
                                    window.print()
                                }
                            >
                                <FileType className="size-4 mr-2" />
                                PDF
                            </MenubarItem>
                            <MenubarItem
                                onClick={onSaveText}
                            >
                                <FileText className="size-4 mr-2" />
                                Text
                            </MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem
                        onClick={() => window.print()}
                    >
                        <Printer className="size-4 mr-2" />
                        Print
                        <MenubarShortcut>
                            ⌘P
                        </MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </>
    );
};
