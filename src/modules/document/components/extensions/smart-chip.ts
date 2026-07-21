import { Mention } from "@tiptap/extension-mention";
import { ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import { PluginKey } from "@tiptap/pm/state";
import tippy, { Instance } from "tippy.js";
import { SmartChipNodeView } from "./smart-chip-node-view";
import { SmartChipList } from "./smart-chip-list";

export const SmartChipPluginKey = new PluginKey("smart-chip");

export const SmartChip = Mention.extend({
    name: "smartChip",

    group: "inline",

    inline: true,

    selectable: true,

    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-id"),
                renderHTML: (attributes) => {
                    if (!attributes.id) {
                        return {};
                    }
                    return { "data-id": attributes.id };
                },
            },
            label: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-label"),
                renderHTML: (attributes) => {
                    if (!attributes.label) {
                        return {};
                    }
                    return { "data-label": attributes.label };
                },
            },
            type: {
                default: "user",
                parseHTML: (element) => element.getAttribute("data-type"),
                renderHTML: (attributes) => {
                    if (!attributes.type) {
                        return {};
                    }
                    return { "data-type": attributes.type };
                },
            },
            avatar: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-avatar"),
                renderHTML: (attributes) => {
                    if (!attributes.avatar) {
                        return {};
                    }
                    return { "data-avatar": attributes.avatar };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="smart-chip"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            {
                "data-type": "smart-chip",
                class: "mention",
                ...HTMLAttributes,
            },
            `@${HTMLAttributes.label}`,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(SmartChipNodeView);
    },
}).configure({
    suggestion: {
        char: "@",
        pluginKey: SmartChipPluginKey,
        command: ({ editor, range, props }) => {
            // Check if node exists and insert custom SmartChip node
            editor
                .chain()
                .focus()
                .insertContentAt(range, [
                    {
                        type: "smartChip",
                        attrs: props,
                    },
                    {
                        type: "text",
                        text: " ",
                    },
                ])
                .run();
        },
        render: () => {
            let component: ReactRenderer | null = null;
            let popup: Instance[] | null = null;

            return {
                onStart: (props) => {
                    component = new ReactRenderer(SmartChipList, {
                        props,
                        editor: props.editor,
                    });

                    if (!props.clientRect) {
                        return;
                    }

                    const getReferenceClientRect = props.clientRect as () => DOMRect;

                    popup = tippy("body", {
                        getReferenceClientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: "manual",
                        placement: "bottom-start",
                    }) as Instance[];
                },

                onUpdate(props) {
                    if (component) {
                        component.updateProps(props);
                    }

                    if (!props.clientRect || !popup || !popup[0]) {
                        return;
                    }

                    const getReferenceClientRect = props.clientRect as () => DOMRect;

                    popup[0].setProps({
                        getReferenceClientRect,
                    });
                },

                onKeyDown(props) {
                    if (props.event.key === "Escape") {
                        if (popup && popup[0]) {
                            popup[0].hide();
                        }
                        return true;
                    }

                    return (component?.ref as { onKeyDown?: (p: { event: KeyboardEvent }) => boolean })?.onKeyDown?.(props) ?? false;
                },

                onExit() {
                    if (popup && popup[0]) {
                        popup[0].destroy();
                    }
                    if (component) {
                        component.destroy();
                    }
                },
            };
        },
    },
});
