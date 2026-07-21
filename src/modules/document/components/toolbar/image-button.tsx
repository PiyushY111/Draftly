import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/providers/editor-store-provider";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export const ImageButton = () => {
    const { editor } = useEditorStore((state) => state);

    const [imageUrl, setImageUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const onChange = (url: string) => {
        editor?.chain().focus().setImage({ src: url }).run();
    };

    const onSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="xs" variant="toolbar">
                    <ImageIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert image URL</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <Input
                        placeholder="Insert image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </form>
                <DialogFooter>
                    <Button onClick={onSubmit}>Insert</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
