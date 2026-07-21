import { Editor } from "@tiptap/react";

export const getCurrentHeading = (editor: Editor | null) => {
    for (let level = 1; level <= 5; level++) {
        if (editor?.isActive("heading", { level })) {
            return `Heading ${level}`;
        }
    }
    return "Normal text";
};
