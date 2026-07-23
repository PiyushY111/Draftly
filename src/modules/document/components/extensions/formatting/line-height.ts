/**
 * source: https://github.com/Leecason/element-tiptap/blob/master/src/utils/line_height.ts
 *
 */

import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type LineHeightOptions = {
    types: string[];
    defaultLineHeight: string;
};

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        lineHeight: {
            setLineHeight: (lineHeight: string) => ReturnType;
            unsetLineHeight: () => ReturnType;
        };
    }
}

export const LineHeight = Extension.create<LineHeightOptions>({
    name: "lineHeight",

    addOptions() {
        return {
            types: ["paragraph", "heading"],
            defaultLineHeight: "normal",
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: this.options.defaultLineHeight,
                        parseHTML: (element) =>
                            element.style.lineHeight ||
                            this.options.defaultLineHeight,
                        renderHTML: (attributes) => {
                            if (!attributes.lineHeight) {
                                return {};
                            }

                            return {
                                style: `line-height: ${attributes.lineHeight}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setLineHeight:
                (lineHeight) =>
                ({ tr, state, dispatch }) => {
                    const { selection } = state;
                    const { from, to } = selection;

                    tr = tr.setSelection(selection);
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        if (this.options.types.includes(node.type.name)) {
                            tr = tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                lineHeight,
                            });
                        }
                    });

                    if (dispatch) {
                        dispatch(tr);
                    }
                    return true;
                },
            unsetLineHeight:
                () =>
                ({ tr, state, dispatch }) => {
                    const { selection } = state;
                    const { from, to } = selection;

                    tr = tr.setSelection(selection);
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        if (this.options.types.includes(node.type.name)) {
                            tr = tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                lineHeight: this.options.defaultLineHeight,
                            });
                        }
                    });

                    if (dispatch) {
                        dispatch(tr);
                    }
                    return true;
                },
        };
    },
});
