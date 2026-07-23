"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";


import { MoreVertical, Edit2, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
    id: string;
    title: string;
    roomId: string;
};

type Props = {
    tab: Tab;
    activeTabId: string;
    onSelectTab: (roomId: string) => void;
    onRename: (tabId: string, title: string) => void;
    onDelete: (tabId: string, e: React.MouseEvent) => void;
    canDelete: boolean;
};

export const TabItem = ({
    tab,
    activeTabId,
    onSelectTab,
    onRename,
    onDelete,
    canDelete,
}: Props) => {
    return (
        <div
            onClick={() => onSelectTab(tab.roomId)}
            className={cn(
                "group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition cursor-pointer",
                activeTabId === tab.roomId && "bg-blue-50/70 text-blue-700 font-medium",
            )}
        >
            <span className="truncate flex-1 text-left">
                {tab.title}
            </span>

            <div
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition"
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-slate-200/60 rounded-md transition">
                            <MoreVertical className="size-3.5 text-slate-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRename(tab.id, tab.title)}>
                            <Edit2 className="size-3.5 mr-2" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => onDelete(tab.id, e)}
                            className="text-destructive focus:text-destructive"
                            disabled={!canDelete}
                        >
                            <Trash className="size-3.5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
