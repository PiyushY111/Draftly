import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/providers/editor-store-provider";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const MAX_FONT_SIZE = 72;
const MIN_FONT_SIZE = 8;

export const FontSizeButton = () => {
    const { editor } = useEditorStore((state) => state);

    const currentFontSize =
        parseInt(editor?.getAttributes("textStyle").fontSize) || 16;

    useEffect(() => {
        setFontSize(currentFontSize);
    }, [currentFontSize]);

    const [fontSize, setFontSize] = useState(currentFontSize);

    const updateFontSize = (value: number) => {
        const size = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, value));

        editor?.chain().focus().setFontSize(`${size}px`).run();
        setFontSize(size);
    };

    const increment = () => {
        const size = Math.min(MAX_FONT_SIZE, fontSize + 1);
        updateFontSize(size);
    };

    const decrement = () => {
        const size = Math.max(MIN_FONT_SIZE, fontSize - 1);
        updateFontSize(size);
    };

    return (
        <div className="flex items-center gap-x-0.5">
            <Button size="xs" variant="toolbar" onClick={decrement}>
                <Minus />
            </Button>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateFontSize(fontSize);
                }}
            >
                <input
                    className="h-7 w-10 rounded-sm border border-neutral-400 bg-transparent text-center text-sm focus:border-transparent focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    value={fontSize}
                    onChange={(e) => {
                        const parsed = parseInt(e.target.value);
                        if (isNaN(parsed)) {
                            return;
                        }

                        setFontSize(parsed);
                    }}
                    onBlur={() => updateFontSize(fontSize)}
                    onFocus={(e) => e.target.select()}
                />
            </form>

            <Button size="xs" variant="toolbar" onClick={increment}>
                <Plus />
            </Button>
        </div>
    );
};
