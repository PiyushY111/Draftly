"use client";
import { Menubar } from "@/components/ui";


import { Id } from "../../../../../convex/_generated/dataModel";
import { FileMenu } from "./navbar-menu/file-menu";
import { EditMenu } from "./navbar-menu/edit-menu";
import { InsertMenu } from "./navbar-menu/insert-menu";
import { FormatMenu } from "./navbar-menu/format-menu";

type Props = {
    id: Id<"documents">;
    title: string;
    onToggleRevisions?: () => void;
};

export const NavbarMenu = ({ id, title, onToggleRevisions }: Props) => {
    return (
        <div className="flex">
            <Menubar className="h-auto border-none bg-transparent p-0 shadow-none">
                <FileMenu
                    id={id}
                    title={title}
                    onToggleRevisions={onToggleRevisions}
                />
                <EditMenu />
                <InsertMenu />
                <FormatMenu />
            </Menubar>
        </div>
    );
};
