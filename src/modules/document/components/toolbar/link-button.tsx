import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEditorStore } from "@/providers/editor-store-provider";
import { Link2Icon } from "lucide-react";
import { useState } from "react";

export const LinkButton = () => {
    const { editor } = useEditorStore((state) => state);
    const [value, setValue] = useState("");

    const onChange = (href: string) => {
        if (href === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
        setValue("");
    };

    return (
        <Popover
            onOpenChange={(open) => {
                if (open) {
                    setValue(editor?.getAttributes("link").href || "");
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button size="xs" variant="toolbar">
                    <Link2Icon />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onChange(value);
                    }}
                    className="flex items-center gap-x-2"
                >
                    <Input
                        placeholder="Paste or type a link"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <Button type="submit">Apply</Button>
                </form>
            </PopoverContent>
        </Popover>
    );
};
