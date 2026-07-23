"use client";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui";


import { useEditorStore } from "@/providers/editor-store-provider";
import { SheetIcon } from "lucide-react";

export const InsertMenu = () => {
    const { editor } = useEditorStore((state) => state);

    const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
        editor
            ?.chain()
            .focus()
            .insertTable({ rows, cols, withHeaderRow: false })
            .run();
    };

    return (
        <MenubarMenu>
            <MenubarTrigger>Insert</MenubarTrigger>
            <MenubarContent>
                <MenubarSub>
                    <MenubarSubTrigger>
                        <SheetIcon className="size-4 mr-2" />
                        Table
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                        <MenubarItem
                            onClick={() =>
                                insertTable({
                                    rows: 1,
                                    cols: 1,
                                })
                            }
                        >
                            1 x 1
                        </MenubarItem>
                        <MenubarItem
                            onClick={() =>
                                insertTable({
                                    rows: 2,
                                    cols: 2,
                                })
                            }
                        >
                            2 x 2
                        </MenubarItem>
                        <MenubarItem
                            onClick={() =>
                                insertTable({
                                    rows: 3,
                                    cols: 3,
                                })
                            }
                        >
                            3 x 3
                        </MenubarItem>
                        <MenubarItem
                            onClick={() =>
                                insertTable({
                                    rows: 4,
                                    cols: 4,
                                })
                            }
                        >
                            4 x 4
                        </MenubarItem>
                    </MenubarSubContent>
                </MenubarSub>
            </MenubarContent>
        </MenubarMenu>
    );
};
