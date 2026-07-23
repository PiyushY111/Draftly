import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input } from "@/components/ui";
import { handleError } from "@/lib/utils";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parentFolderId?: Id<"folders">;
};

export const CreateFolderDialog = ({
    open,
    onOpenChange,
    parentFolderId,
}: Props) => {
    const [name, setName] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.folders.create),
    });

    const onCreate = () => {
        const folderName = name.trim() || "New Folder";
        mutate(
            { name: folderName, parentFolderId },
            {
                onSuccess() {
                    onOpenChange(false);
                    setName("");
                    toast.success("Folder created successfully");
                },
                onError(error) {
                    handleError(error);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) setName("");
            onOpenChange(val);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Folder</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new folder
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onCreate();
                    }}
                    className="space-y-4"
                >
                    <Input
                        placeholder="Folder name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <DialogFooter className="justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
