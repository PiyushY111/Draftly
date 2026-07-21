import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEditorStore } from "@/providers/editor-store-provider";
import { CirclePicker, ColorResult } from "react-color";

const COLORS = [
    "#000000",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#607d8b",
];

export const TextColorButton = () => {
    const { editor } = useEditorStore((state) => state);

    const value = editor?.getAttributes("textStyle").color || "#000000";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="xs"
                    variant="toolbar"
                    className="flex-col items-center gap-y-0.5"
                >
                    <span className="text-xs">A</span>
                    <div
                        className="h-0.5 w-full"
                        style={{ backgroundColor: value }}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="start">
                <CirclePicker
                    color={value}
                    onChange={onChange}
                    colors={COLORS}
                />
            </PopoverContent>
        </Popover>
    );
};
