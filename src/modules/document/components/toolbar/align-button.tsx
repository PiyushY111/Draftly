import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/providers/editor-store-provider";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    LucideIcon,
} from "lucide-react";

type Alignment = {
    label: string;
    value: string;
    icon: LucideIcon;
};

export const ALIGNMENTS: Alignment[] = [
    {
        label: "Left",
        value: "left",
        icon: AlignLeft,
    },
    {
        label: "Center",
        value: "center",
        icon: AlignCenter,
    },
    {
        label: "Right",
        value: "right",
        icon: AlignRight,
    },
    {
        label: "Justify",
        value: "justify",
        icon: AlignJustify,
    },
];

export const AlignButton = () => {
    const { editor } = useEditorStore((state) => state);

    const alignment =
        ALIGNMENTS.find(({ value }) =>
            editor?.isActive({ textAlign: value }),
        ) ?? ALIGNMENTS[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="xs" variant="toolbar">
                    <alignment.icon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="space-y-1">
                {ALIGNMENTS.map(({ label, value, icon: Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        className={cn(
                            editor?.isActive({ textAlign: value }) &&
                                "bg-accent text-accent-foreground",
                        )}
                        onClick={() =>
                            editor?.chain().focus().setTextAlign(value).run()
                        }
                    >
                        <Icon />
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
