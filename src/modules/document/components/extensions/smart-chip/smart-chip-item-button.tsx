"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";


import { Calendar, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartChipItem } from "../../../hooks/use-smart-chip-data";

type Props = {
    item: SmartChipItem;
    isSelected: boolean;
    onClick: () => void;
};

export const SmartChipItemButton = ({ item, isSelected, onClick }: Props) => {
    return (
        <button
            className={cn(
                "flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition hover:bg-slate-50 cursor-pointer",
                isSelected && "bg-slate-100 text-slate-900 font-medium",
            )}
            onClick={onClick}
        >
            {item.type === "user" && (
                <>
                    {item.avatar ? (
                        <Avatar className="size-4 shrink-0">
                            <AvatarImage src={item.avatar} alt={item.label} />
                            <AvatarFallback className="text-[8px]">
                                {item.label.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <User className="size-3.5 text-slate-400 shrink-0" />
                    )}
                </>
            )}
            {item.type === "document" && (
                <FileText className="size-3.5 text-blue-500 shrink-0" />
            )}
            {item.type === "date" && (
                <Calendar className="size-3.5 text-amber-600 shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
        </button>
    );
};
