import { Mark, mergeAttributes } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

export const AuthorMark = Mark.create({
    name: "author",

    addOptions() {
        return {
            userId: "",
            color: "",
            userName: "",
            enabled: true,
        };
    },

    addAttributes() {
        return {
            userId: { default: null },
            color: { default: null },
            userName: { default: null },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span[data-author-id]",
                getAttrs: (element) => {
                    if (typeof element === "string") return {};
                    return {
                        userId: element.getAttribute("data-author-id"),
                        color: element.getAttribute("data-author-color"),
                        userName: element.getAttribute("data-author-name"),
                    };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        if (!this.options.enabled) {
            return ["span", mergeAttributes(HTMLAttributes), 0];
        }
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-author-id": HTMLAttributes.userId,
                "data-author-color": HTMLAttributes.color,
                "data-author-name": HTMLAttributes.userName,
                style: `background-color: ${HTMLAttributes.color}25; border-bottom: 2px solid ${HTMLAttributes.color};`,
                class: "author-highlight",
                title: `Written by ${HTMLAttributes.userName}`,
            }),
            0,
        ];
    },

    addProseMirrorPlugins() {
        const { userId, color, userName } = this.options;
        if (!userId) return [];

        return [
            new Plugin({
                appendTransaction(transactions, oldState, newState) {
                    if (!transactions.some((tr) => tr.docChanged)) return null;

                    const tr = newState.tr;
                    let modified = false;

                    transactions.forEach((transaction) => {
                        if (!transaction.docChanged) return;

                        transaction.mapping.maps.forEach((stepMap) => {
                            stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
                                if (newStart < newEnd) {
                                    tr.addMark(
                                        newStart,
                                        newEnd,
                                        newState.schema.marks.author.create({
                                            userId,
                                            color,
                                            userName,
                                        })
                                    );
                                    modified = true;
                                }
                            });
                        });
                    });

                    return modified ? tr : null;
                },
            }),
        ];
    },
});
