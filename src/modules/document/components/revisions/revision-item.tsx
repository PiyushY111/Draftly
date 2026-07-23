"use client";
import { Button } from "@/components/ui";


import { Calendar, User, CornerUpLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Id } from "../../../../../convex/_generated/dataModel";

type Revision = {
    _id: Id<"revisions">;
    title: string;
    content: string;
    createdAt: number;
    createdByName: string;
};

type Props = {
    revision: Revision;
    isActive: boolean;
    isTimeTraveling: boolean;
    onClick: () => void;
    onRestore: () => void;
};

export const RevisionItem = ({
    revision,
    isActive,
    isTimeTraveling,
    onClick,
    onRestore,
}: Props) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex flex-col gap-1.5 p-3 border rounded-xl shadow-sm transition hover:shadow-md cursor-pointer text-left",
                isActive
                    ? "border-blue-500 bg-blue-50/30"
                    : "border-slate-100 hover:border-slate-200 bg-white",
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-slate-700 truncate">
                    {revision.title}
                </span>
                {isTimeTraveling && isActive && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRestore();
                        }}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[10px] gap-1 font-bold border-blue-200 hover:bg-blue-600 hover:text-white"
                    >
                        <CornerUpLeft className="size-3" />
                        Restore
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {format(revision.createdAt, "MMM d, yyyy h:mm a")}
                </span>
                <span className="flex items-center gap-1">
                    <User className="size-3" />
                    By {revision.createdByName}
                </span>
            </div>
        </div>
    );
};
