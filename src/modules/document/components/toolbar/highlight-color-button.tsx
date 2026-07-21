import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEditorStore } from "@/providers/editor-store-provider";
import { DropletOff, HighlighterIcon } from "lucide-react";
import { CirclePicker, ColorResult } from "react-color";

export const HighlightColorButton = () => {
    const { editor } = useEditorStore((state) => state);

    const value = editor?.getAttributes("highlight").color || "#FFFFFF";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run();
    };

    const unsetHighlight = () => {
        editor?.chain().focus().unsetHighlight().run();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="xs"
                    variant="toolbar"
                    className="flex-col items-center justify-center gap-y-0.5"
                >
                    <HighlighterIcon className="size-3" />
                    <div
                        className="h-0.5 w-full"
                        style={{ backgroundColor: value }}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
                <button
                    className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                    onClick={unsetHighlight}
                >
                    <DropletOff className="text-foreground size-4" />
                    Transparent
                </button>
                <div className="p-2">
                    <CirclePicker color={value} onChange={onChange} />
                </div>
            </PopoverContent>
        </Popover>
    );
};
