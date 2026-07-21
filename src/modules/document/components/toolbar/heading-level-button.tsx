import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/providers/editor-store-provider";
import { type Level } from "@tiptap/extension-heading";
import { ChevronDown } from "lucide-react";
import { getCurrentHeading } from "../../lib/utils";

type HeadingLevel = {
    label: string;
    value: number;
    fontSize: string;
};

const HEADING_LEVELS: HeadingLevel[] = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "18px" },
];

export const HeadingLevelButton = () => {
    const { editor } = useEditorStore((state) => state);
    const currentHeading = getCurrentHeading(editor);

    const onChange = (value: number) => {
        if (value === 0) {
            editor?.chain().focus().setParagraph().run();
        } else {
            editor
                ?.chain()
                .focus()
                .setHeading({ level: value as Level })
                .run();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="xs"
                    variant="toolbar"
                    className="w-[120px] justify-between"
                >
                    <span className="truncate font-normal">
                        {currentHeading}
                    </span>
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-1" align="start">
                {HEADING_LEVELS.map(({ label, value, fontSize }) => (
                    <DropdownMenuItem
                        key={value}
                        className={cn(
                            (value === 0 && !editor?.isActive("heading")) ||
                                (editor?.isActive("heading", {
                                    level: value,
                                }) &&
                                    "bg-accent text-accent-foreground"),
                        )}
                        onClick={() => onChange(value)}
                    >
                        <span style={{ fontSize }}>{label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
