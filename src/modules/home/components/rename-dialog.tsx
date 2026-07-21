import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { handleError } from "@/lib/utils";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentId: Id<"documents">;
    title: string;
};

export const RenameDialog = ({
    open,
    onOpenChange,
    documentId,
    title,
}: Props) => {
    const [value, setValue] = useState(title);

    useEffect(() => {
        setValue(title);
    }, [title]);

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.documents.update),
    });

    const onRename = () => {
        const newTitle = value.trim() || "Untitled document";
        mutate(
            { id: documentId, title: newTitle },
            {
                onSuccess() {
                    onOpenChange(false);
                    toast.success("Document renamed successfully");
                },
                onError(error) {
                    handleError(error);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename document</DialogTitle>
                    <DialogDescription>
                        Enter a new name for the document
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onRename();
                    }}
                    className="space-y-4"
                >
                    <Input
                        placeholder="Document name"
                        autoFocus
                        onFocus={(e) => e.target.select()}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <DialogFooter className="justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
