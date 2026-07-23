"use client";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "@/components/ui";


import { useEditorStore } from "@/providers/editor-store-provider";
import { Redo2, Undo2 } from "lucide-react";

export const EditMenu = () => {
    const { editor } = useEditorStore((state) => state);

    return (
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
                    <Undo2 className="size-4 mr-2" />
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
                    <Redo2 className="size-4 mr-2" />
                    Redo
                    <MenubarShortcut>
                        ⌘Y
                    </MenubarShortcut>
                </MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    );
};
