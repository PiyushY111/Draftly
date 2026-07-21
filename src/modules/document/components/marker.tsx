import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDownToLine } from "lucide-react";
import type { CSSProperties } from "react";

type Props = {
    side: "left" | "right";
    position: number;
    id: string;
    isDragging?: boolean;
};

export const Marker = ({ side, position, id, isDragging }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style: CSSProperties = {
        ...(side === "left"
            ? { left: `${position}px` }
            : { right: `${position}px` }),
        transform: CSS.Translate.toString(transform),
        cursor: "ew-resize",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="absolute top-0 z-10"
        >
            <ArrowDownToLine
                className={cn(
                    "size-4 h-full transform text-blue-600",
                    side === "right"
                        ? "translate-x-full rotate-90"
                        : "-translate-x-full -rotate-90",
                    isDragging ? "scale-110 text-blue-800" : "text-blue-600",
                )}
            />
            {isDragging && (
                <div
                    className={cn(
                        "pointer-events-none absolute top-0 h-screen w-[1px] bg-blue-600",
                        side === "left"
                            ? "left-0 translate-x-1.5"
                            : "right-0 -translate-x-1.5",
                    )}
                />
            )}
        </div>
    );
};
