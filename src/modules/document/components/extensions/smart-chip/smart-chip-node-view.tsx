"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";


import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { Calendar, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const SmartChipNodeView = (props: ReactNodeViewProps) => {
    const { id, label, type, avatar } = props.node.attrs as {
        id: string;
        label: string;
        type: "user" | "document" | "date";
        avatar?: string;
    };

    const handleClick = (e: React.MouseEvent) => {
        if (type === "document" && id) {
            e.preventDefault();
            window.open(`/documents/${id}`, "_blank");
        }
    };

    return (
        <NodeViewWrapper className="inline-block select-all" as="span">
            <span
                onClick={handleClick}
                contentEditable={false}
                className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 mx-0.5 rounded-full text-sm font-medium border transition cursor-pointer select-none align-baseline",
                    type === "document" &&
                        "bg-blue-50/80 text-blue-600 border-blue-200 hover:bg-blue-100/90",
                    type === "user" &&
                        "bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100/90",
                    type === "date" &&
                        "bg-amber-50/80 text-amber-700 border-amber-200 hover:bg-amber-100/90",
                )}
            >
                {type === "document" && (
                    <FileText className="size-3.5 text-blue-500 shrink-0" />
                )}
                {type === "date" && (
                    <Calendar className="size-3.5 text-amber-600 shrink-0" />
                )}
                {type === "user" && (
                    <>
                        {avatar ? (
                            <Avatar className="size-4 shrink-0">
                                <AvatarImage src={avatar} alt={label} />
                                <AvatarFallback className="text-[9px]">
                                    {label.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <User className="size-3.5 text-slate-500 shrink-0" />
                        )}
                    </>
                )}
                <span className="truncate max-w-[150px]">{label}</span>
            </span>
        </NodeViewWrapper>
    );
};
