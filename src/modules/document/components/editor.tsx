"use client";

import { useEditorStore } from "@/providers/editor-store-provider";

import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";

import { FontSize } from "./extensions/font-size";
import { LineHeight } from "./extensions/line-height";
import { SmartChip } from "./extensions/smart-chip";

import { Ruler } from "./ruler";

import { Threads } from "@/modules/room/components/threads";
import { FloatingToolbar, useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useRuler } from "../hooks/use-ruler";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
    documentId: Id<"documents">;
    initialContent?: string;
    editable?: boolean;
    isTimeTraveling?: boolean;
};

const getUserColor = (id?: string) => {
    if (!id) return "#3b82f6";
    const colors = [
        "#3b82f6", // blue
        "#ef4444", // red
        "#10b981", // green
        "#f59e0b", // yellow
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#06b6d4", // cyan
        "#f97316", // orange
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

export const Editor = ({ documentId, initialContent, editable = true, isTimeTraveling = false }: Props) => {
    const { setEditor } = useEditorStore((state) => state);
    const { user } = useUser();

    const createRevision = useMutation(api.documents.createRevision);
    const lastSavedContentRef = useRef<string>("");
    const lastSaveTimeRef = useRef<number>(0);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const documentIdRef = useRef(documentId);
    documentIdRef.current = documentId;

    const isTimeTravelingRef = useRef(isTimeTraveling);
    isTimeTravelingRef.current = isTimeTraveling;

    // Helper to perform the actual save
    const saveIfNeeded = async (content: string) => {
        if (
            content === lastSavedContentRef.current ||
            content === "<p></p>"
        ) {
            return;
        }

        try {
            const timeStr = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).format(new Date());

            await createRevision({
                documentId: documentIdRef.current,
                content,
                title: `Auto-save (${timeStr})`,
            });
            lastSavedContentRef.current = content;
            lastSaveTimeRef.current = Date.now();
        } catch (err) {
            console.error("[Auto-save Error]:", err);
        }
    };

    const liveblocks = useLiveblocksExtension({
        initialContent,
        offlineSupport_experimental: true,
    });

    const [leftPadding] = useRuler("leftPadding");
    const [rightPadding] = useRuler("rightPadding");

    const extensions = [
        StarterKit.configure({
            history: isTimeTraveling ? false : undefined,
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        ImageResize,
        Underline,
        TextStyle,
        FontFamily,
        Color,
        Highlight.configure({ multicolor: true }),
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: "https",
            protocols: ["http", "https"],
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"],
            defaultAlignment: "left",
        }),
        FontSize,
        LineHeight.configure({
            types: ["heading", "paragraph"],
            defaultLineHeight: "normal",
        }),
        SmartChip,
    ];

    if (!isTimeTraveling) {
        extensions.unshift(liveblocks);
    }

    const editor = useEditor({
        immediatelyRender: false,
        autofocus: true,
        editable,
        content: isTimeTraveling ? initialContent : undefined,

        onCreate({ editor }) {
            setEditor(editor);
            lastSavedContentRef.current = editor.getHTML();
        },

        onDestroy() {
            setEditor(null);
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        },

        onUpdate({ editor }) {
            setEditor(editor);

            if (editor.isFocused && !isTimeTravelingRef.current) {
                const currentContent = editor.getHTML();
                if (autoSaveTimeoutRef.current) {
                    clearTimeout(autoSaveTimeoutRef.current);
                }

                // Debounce for 3 seconds of inactivity
                autoSaveTimeoutRef.current = setTimeout(async () => {
                    const now = Date.now();
                    const timeSinceLastSave = now - lastSaveTimeRef.current;
                    const cooldown = 15000; // 15 seconds cooldown

                    if (timeSinceLastSave >= cooldown) {
                        await saveIfNeeded(currentContent);
                    } else {
                        // Cooldown is active, reschedule the save to run as soon as cooldown expires
                        const remainingTime = cooldown - timeSinceLastSave;
                        if (autoSaveTimeoutRef.current) {
                            clearTimeout(autoSaveTimeoutRef.current);
                        }
                        autoSaveTimeoutRef.current = setTimeout(async () => {
                            if (editor.isDestroyed) return;
                            await saveIfNeeded(editor.getHTML());
                        }, remainingTime);
                    }
                }, 3000);
            }
        },

        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },

        onTransaction({ editor }) {
            setEditor(editor);
        },

        onFocus({ editor }) {
            setEditor(editor);
        },

        onBlur({ editor }) {
            setEditor(editor);
        },

        onContentError({ editor }) {
            setEditor(editor);
        },

        editorProps: {
            attributes: {
                style: `padding-left: ${leftPadding}px; padding-right: ${rightPadding}px;`,
                class: "flex min-h-[1054px] w-[816px] cursor-text flex-col border border-[#c7c7c7] bg-white py-10 pr-14 focus:outline-none print:border-0",
            },
            handleDrop(view, event, slice, moved) {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                    const files = Array.from(event.dataTransfer.files);
                    const imageFiles = files.filter(file => /image\/(png|jpe?g|gif|webp)/.test(file.type));
                    if (imageFiles.length > 0) {
                        event.preventDefault();
                        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                        const pos = coordinates ? coordinates.pos : view.state.doc.content.size;
                        
                        imageFiles.forEach((file) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                if (view.isDestroyed) return;
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: reader.result });
                                const transaction = view.state.tr.insert(pos, node);
                                view.dispatch(transaction);
                            };
                        });
                        return true;
                    }
                }
                return false;
            },
            handlePaste(view, event) {
                if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
                    const files = Array.from(event.clipboardData.files);
                    const imageFiles = files.filter(file => /image\/(png|jpe?g|gif|webp)/.test(file.type));
                    if (imageFiles.length > 0) {
                        event.preventDefault();
                        imageFiles.forEach((file) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                if (view.isDestroyed) return;
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: reader.result });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            };
                        });
                        return true;
                    }
                }
                return false;
            }
        },
        extensions,
    });

    return (
        <div className="size-full overflow-x-auto bg-[#f9fbfd] px-4 print:overflow-visible print:bg-white print:p-0">
            <Ruler />
            <div className="mx-auto flex w-[816px] min-w-max justify-center py-4 print:w-full print:min-w-0 print:py-0">
                <EditorContent editor={editor} />
                {!isTimeTraveling && <Threads editor={editor} />}
                {!isTimeTraveling && <FloatingToolbar editor={editor} />}
            </div>
        </div>
    );
};
