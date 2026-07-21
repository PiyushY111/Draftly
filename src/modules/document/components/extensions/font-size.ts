/**
 * source: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-font-family/src/font-family.ts
 * To create font-size extension, we can copy the font-family extension and replace all "fontSize" with "fontSize".
 */

import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (fontSize: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
}

export const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                ({ chain }) => {
                    return chain().setMark("textStyle", { fontSize }).run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: null })
                        .removeEmptyTextStyle()
                        .run();
                },
        };
    },
});
