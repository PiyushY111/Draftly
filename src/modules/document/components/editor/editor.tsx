"use client";

import { useEditorStore } from "@/providers/editor-store-provider";
import { EditorContent, useEditor } from "@tiptap/react";
import { Ruler } from "../editor/ruler";
import { Threads } from "@/modules/room/components/threads";
import { FloatingToolbar, useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useRuler } from "../../hooks/use-ruler";
import { useMutation } from "convex/react";
import { useRef } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { getEditorExtensions } from "../editor/editor-extensions";
import { handleDrop, handlePaste } from "../../lib/editor-events";

type Props = {
    documentId: Id<"documents">;
    initialContent?: string;
    editable?: boolean;
    isTimeTraveling?: boolean;
};

export const Editor = ({ documentId, initialContent, editable = true, isTimeTraveling = false }: Props) => {
    const { setEditor } = useEditorStore((state) => state);

    const createRevision = useMutation(api.documents.createRevision);
    const lastSavedContentRef = useRef<string>("");
    const lastSaveTimeRef = useRef<number>(0);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const documentIdRef = useRef(documentId);
    documentIdRef.current = documentId;
    const isTimeTravelingRef = useRef(isTimeTraveling);
    isTimeTravelingRef.current = isTimeTraveling;

    const saveIfNeeded = async (content: string) => {
        if (content === lastSavedContentRef.current || content === "<p></p>") return;
        try {
            const timeStr = new Intl.DateTimeFormat("en-US", {
                month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
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

    const extensions = getEditorExtensions(isTimeTraveling);
    if (!isTimeTraveling) extensions.unshift(liveblocks);

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
            if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
        },
        onUpdate({ editor }) {
            setEditor(editor);
            if (editor.isFocused && !isTimeTravelingRef.current) {
                const currentContent = editor.getHTML();
                if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

                autoSaveTimeoutRef.current = setTimeout(async () => {
                    const now = Date.now();
                    const timeSinceLastSave = now - lastSaveTimeRef.current;
                    const cooldown = 15000;

                    if (timeSinceLastSave >= cooldown) {
                        await saveIfNeeded(currentContent);
                    } else {
                        const remainingTime = cooldown - timeSinceLastSave;
                        if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
                        autoSaveTimeoutRef.current = setTimeout(async () => {
                            if (editor.isDestroyed) return;
                            await saveIfNeeded(editor.getHTML());
                        }, remainingTime);
                    }
                }, 3000);
            }
        },
        onSelectionUpdate({ editor }) { setEditor(editor); },
        onTransaction({ editor }) { setEditor(editor); },
        onFocus({ editor }) { setEditor(editor); },
        onBlur({ editor }) { setEditor(editor); },
        onContentError({ editor }) { setEditor(editor); },
        editorProps: {
            attributes: {
                style: `padding-left: ${leftPadding}px; padding-right: ${rightPadding}px;`,
                class: "flex min-h-[1054px] w-[816px] cursor-text flex-col border border-[#c7c7c7] bg-white py-10 pr-14 focus:outline-none print:border-0",
            },
            handleDrop,
            handlePaste,
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
