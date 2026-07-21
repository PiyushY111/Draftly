import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/providers/editor-store-provider";
import { type Editor } from "@tiptap/react";
import { List, ListIcon, ListOrdered, LucideIcon } from "lucide-react";

type List = {
    label: string;
    icon: LucideIcon;
    isActive: boolean;
    onClick: () => void;
};

function makeListButton(editor: Editor | null) {
    const lists: List[] = [
        {
            label: "Bullet List",
            icon: List,
            isActive: editor?.isActive("bulletList") || false,
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "Ordered List",
            icon: ListOrdered,
            isActive: editor?.isActive("orderedList") || false,
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        },
    ];

    return lists;
}

export const ListButton = () => {
    const { editor } = useEditorStore((state) => state);

    const list = makeListButton(editor);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="xs" variant="toolbar">
                    <ListIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="space-y-1">
                {list.map(({ label, icon: Icon, isActive, onClick }) => (
                    <DropdownMenuItem
                        key={label}
                        onClick={onClick}
                        className={cn(
                            isActive && "text-accent-foreground bg-accent",
                        )}
                    >
                        <Icon />
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
