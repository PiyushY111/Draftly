"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { handleError } from "@/lib/utils";
import { RenameDialog } from "@/modules/home/components/rename-dialog";
import { AvatarStack } from "@/modules/room/components/avatar-stack";
import { Inbox } from "@/modules/room/components/inbox";
import { useEditorStore } from "@/providers/editor-store-provider";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
    Bold,
    Download,
    FileJson,
    FilePen,
    FilePlus,
    FileText,
    FileType,
    Globe,
    History,
    Italic,
    Printer,
    Redo2,
    RemoveFormatting,
    SheetIcon,
    Strikethrough,
    TextIcon,
    Trash,
    Underline,
    Undo2,
    UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { DocumentInput } from "./document-input";
import { VoiceTalk } from "./voice-talk";
import { ShareDialog } from "./share-dialog";
type Props = {
    id: Id<"documents">;
    title: string;
    onToggleRevisions?: () => void;
};

export const Navbar = ({ id, title, onToggleRevisions }: Props) => {
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
    const [isShareOpen, setIsShareOpen] = useState(false);

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

    const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
        editor
            ?.chain()
            .focus()
            .insertTable({ rows, cols, withHeaderRow: false })
            .run();
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
            <ShareDialog
                documentId={id}
                open={isShareOpen}
                onOpenChange={setIsShareOpen}
            />
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
            <nav className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={36}
                            height={36}
                        />
                    </Link>
                    <div className="flex flex-col">
                        <DocumentInput id={id} title={title} />
                        <div className="flex">
                            <Menubar className="h-auto border-none bg-transparent p-0 shadow-none">
                                <MenubarMenu>
                                    <MenubarTrigger>File</MenubarTrigger>
                                    <MenubarContent className="print:hidden">
                                        <MenubarItem
                                            onClick={onCreateDocument}
                                            disabled={create.isPending}
                                        >
                                            <FilePlus />
                                            New Document
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() => setOpenRename(true)}
                                        >
                                            <FilePen />
                                            Rename
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() => setOpenConfirm(true)}
                                        >
                                            <Trash />
                                            Remove
                                        </MenubarItem>
                                        <MenubarSeparator />
                                        <MenubarSub>
                                            <MenubarSubTrigger>
                                                <Download />
                                                Export
                                            </MenubarSubTrigger>
                                            <MenubarSubContent>
                                                <MenubarItem
                                                    onClick={onSaveJSON}
                                                >
                                                    <FileJson />
                                                    JSON
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={onSaveHTML}
                                                >
                                                    <Globe />
                                                    HTML
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        window.print()
                                                    }
                                                >
                                                    <FileType />
                                                    PDF
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={onSaveText}
                                                >
                                                    <FileText />
                                                    Text
                                                </MenubarItem>
                                            </MenubarSubContent>
                                        </MenubarSub>
                                        <MenubarSeparator />
                                        <MenubarItem
                                            onClick={() => window.print()}
                                        >
                                            <Printer />
                                            Print
                                            <MenubarShortcut>
                                                ⌘P
                                            </MenubarShortcut>
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>

                                <MenubarMenu>
                                    <MenubarTrigger>Edit</MenubarTrigger>
                                    <MenubarContent>
                                        <MenubarItem
                                            onClick={() =>
                                                editor
                                                    ?.chain()
                                                    .focus()
                                                    .undo()
                                                    .run()
                                            }
                                        >
                                            <Undo2 />
                                            Undo
                                            <MenubarShortcut>
                                                ⌘Z
                                            </MenubarShortcut>
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                editor
                                                    ?.chain()
                                                    .focus()
                                                    .redo()
                                                    .run()
                                            }
                                        >
                                            <Redo2 />
                                            Redo
                                            <MenubarShortcut>
                                                ⌘Y
                                            </MenubarShortcut>
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>

                                <MenubarMenu>
                                    <MenubarTrigger>Insert</MenubarTrigger>
                                    <MenubarContent>
                                        <MenubarSub>
                                            <MenubarSubTrigger>
                                                <SheetIcon />
                                                Table
                                            </MenubarSubTrigger>
                                            <MenubarSubContent>
                                                <MenubarItem
                                                    onClick={() =>
                                                        insertTable({
                                                            rows: 1,
                                                            cols: 1,
                                                        })
                                                    }
                                                >
                                                    1 x 1
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        insertTable({
                                                            rows: 2,
                                                            cols: 2,
                                                        })
                                                    }
                                                >
                                                    2 x 2
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        insertTable({
                                                            rows: 3,
                                                            cols: 3,
                                                        })
                                                    }
                                                >
                                                    3 x 3
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        insertTable({
                                                            rows: 4,
                                                            cols: 4,
                                                        })
                                                    }
                                                >
                                                    4 x 4
                                                </MenubarItem>
                                            </MenubarSubContent>
                                        </MenubarSub>
                                    </MenubarContent>
                                </MenubarMenu>

                                <MenubarMenu>
                                    <MenubarTrigger>Format</MenubarTrigger>
                                    <MenubarContent>
                                        <MenubarSub>
                                            <MenubarSubTrigger>
                                                <TextIcon />
                                                Text
                                            </MenubarSubTrigger>
                                            <MenubarSubContent>
                                                <MenubarItem
                                                    onClick={() =>
                                                        editor
                                                            ?.chain()
                                                            .focus()
                                                            .toggleBold()
                                                            .run()
                                                    }
                                                >
                                                    <Bold />
                                                    Bold
                                                    <MenubarShortcut>
                                                        ⌘B
                                                    </MenubarShortcut>
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        editor
                                                            ?.chain()
                                                            .focus()
                                                            .toggleItalic()
                                                            .run()
                                                    }
                                                >
                                                    <Italic />
                                                    Italic
                                                    <MenubarShortcut>
                                                        ⌘I
                                                    </MenubarShortcut>
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        editor
                                                            ?.chain()
                                                            .focus()
                                                            .toggleUnderline()
                                                            .run()
                                                    }
                                                >
                                                    <Underline />
                                                    Underline
                                                    <MenubarShortcut>
                                                        ⌘U
                                                    </MenubarShortcut>
                                                </MenubarItem>
                                                <MenubarItem
                                                    onClick={() =>
                                                        editor
                                                            ?.chain()
                                                            .focus()
                                                            .toggleStrike()
                                                            .run()
                                                    }
                                                >
                                                    <Strikethrough />
                                                    Strike
                                                    <MenubarShortcut>
                                                        ⌘S
                                                    </MenubarShortcut>
                                                </MenubarItem>
                                            </MenubarSubContent>
                                        </MenubarSub>
                                        <MenubarItem
                                            onClick={() =>
                                                editor
                                                    ?.chain()
                                                    .focus()
                                                    .unsetAllMarks()
                                                    .run()
                                            }
                                        >
                                            <RemoveFormatting />
                                            Clear Formatting
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsShareOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full gap-2 px-4 h-8 shadow-sm shrink-0 text-xs"
                    >
                        <UserPlus className="size-4" />
                        Share
                    </Button>
                    <VoiceTalk />
                    <AvatarStack />
                    <Inbox />
                    <OrganizationSwitcher
                        hideSlug
                        afterCreateOrganizationUrl="/"
                        afterLeaveOrganizationUrl="/"
                        afterSelectOrganizationUrl="/"
                        afterSelectPersonalUrl="/"
                    />
                    <UserButton />
                </div>
            </nav>
        </>
    );
};
