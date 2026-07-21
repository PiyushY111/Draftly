import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleError } from "@/lib/utils";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { ExternalLink, FilePen, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { RenameDialog } from "./rename-dialog";

type Props = {
    id: Id<"documents">;
    title: string;
    canRemove: boolean;
};

export const DocumentMenu = ({ id, title, canRemove }: Props) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openRename, setOpenRename] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.documents.remove),
    });

    const onRemove = () => {
        mutate(
            { id },
            {
                onSuccess() {
                    toast.success("Document removed successfully");
                },
                onError(error) {
                    handleError(error);
                },
            },
        );
    };

    return (
        <>
            <ConfirmDialog
                onConfirm={onRemove}
                disabled={isPending}
                open={openConfirm}
                onOpenChange={setOpenConfirm}
                title={`Remove "${title}"`}
                message="Are you sure you want to remove this document?"
            />
            <RenameDialog
                documentId={id}
                title={title}
                open={openRename}
                onOpenChange={setOpenRename}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                    >
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenRename(true)}>
                        <FilePen />
                        Rename
                    </DropdownMenuItem>
                    {canRemove && (
                        <DropdownMenuItem onClick={() => setOpenConfirm(true)}>
                            <Trash />
                            Remove
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href={`/documents/${id}`} target="_blank">
                            <ExternalLink />
                            Open in a new tab
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
