import { type Editor } from "@tiptap/react";
import { createStore } from "zustand/vanilla";

export type EditorStore = {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void;
};

export const createEditorStore = () => {
    return createStore<EditorStore>()((set) => ({
        editor: null,
        setEditor: (editor) => set({ editor }),
    }));
};
