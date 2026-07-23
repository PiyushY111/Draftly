"use client";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui";


import { useEditorStore } from "@/providers/editor-store-provider";
import {
    Bold,
    Italic,
    RemoveFormatting,
    Strikethrough,
    TextIcon,
    Underline,
} from "lucide-react";

export const FormatMenu = () => {
    const { editor } = useEditorStore((state) => state);

    return (
        <MenubarMenu>
            <MenubarTrigger>Format</MenubarTrigger>
            <MenubarContent>
                <MenubarSub>
                    <MenubarSubTrigger>
                        <TextIcon className="size-4 mr-2" />
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
                            <Bold className="size-4 mr-2" />
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
                            <Italic className="size-4 mr-2" />
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
                            <Underline className="size-4 mr-2" />
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
                            <Strikethrough className="size-4 mr-2" />
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
                    <RemoveFormatting className="size-4 mr-2" />
                    Clear Formatting
                </MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    );
};
