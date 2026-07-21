import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/providers/editor-store-provider";
import { ListCollapse } from "lucide-react";

type LineHeight = {
    label: string;
    value: string;
};

export const LINE_HEIGHTS: LineHeight[] = [
    {
        label: "Default",
        value: "normal",
    },
    {
        label: "Single",
        value: "1",
    },
    {
        label: "1.15",
        value: "1.15",
    },
    {
        label: "1.5",
        value: "1.5",
    },
    {
        label: "Double",
        value: "2",
    },
];

export const LineHeightButton = () => {
    const { editor } = useEditorStore((state) => state);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="xs" variant="toolbar">
                    <ListCollapse className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="space-y-1">
                {LINE_HEIGHTS.map(({ label, value }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() =>
                            editor?.chain().focus().setLineHeight(value).run()
                        }
                        className={cn(
                            editor?.getAttributes("paragraph").lineHeight ===
                                value && "bg-accent text-accent-foreground",
                        )}
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
