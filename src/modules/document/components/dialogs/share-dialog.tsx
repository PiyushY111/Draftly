"use client";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";


import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { UserPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ShareForm } from "../dialogs/share-form";
import { SharedCollaboratorsList } from "../dialogs/shared-collaborators-list";

type Props = {
    documentId: Id<"documents">;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const ShareDialog = ({ documentId, open, onOpenChange }: Props) => {
    const { user } = useUser();
    const document = useQuery(api.documents.get, { id: documentId });

    if (!document) return null;

    const isOwner = document.ownerId === user?.id;
    const sharedEmails = document.sharedEmails || [];
    const ownerName = user?.fullName || user?.emailAddresses[0]?.emailAddress || "A collaborator";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-800">
                        <UserPlus className="size-5 text-blue-500" />
                        Share &ldquo;{document.title}&rdquo;
                    </DialogTitle>
                    <DialogDescription>
                        Give access to collaborators by entering their email address.
                    </DialogDescription>
                </DialogHeader>

                <ShareForm
                    documentId={documentId}
                    documentTitle={document.title}
                    isOwner={isOwner}
                    ownerName={ownerName}
                />

                <SharedCollaboratorsList
                    documentId={documentId}
                    sharedEmails={sharedEmails}
                    isOwner={isOwner}
                />

                <DialogFooter className="mt-4 justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="rounded-lg text-sm">
                            Done
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
