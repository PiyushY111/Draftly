"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
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
import { toast } from "sonner";
import { UserPlus, Trash2, Mail, ShieldAlert } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type Props = {
    documentId: Id<"documents">;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const ShareDialog = ({ documentId, open, onOpenChange }: Props) => {
    const { user } = useUser();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Convex queries and mutations
    const document = useQuery(api.documents.get, { id: documentId });
    const share = useMutation(api.documents.share);
    const unshare = useMutation(api.documents.unshare);

    if (!document) return null;

    const isOwner = document.ownerId === user?.id;
    const sharedEmails = document.sharedEmails || [];

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetEmail = email.trim().toLowerCase();
        if (!targetEmail) return;

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(targetEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        try {
            await share({ id: documentId, email: targetEmail });
            toast.success(`Access shared with ${targetEmail}`);
            setEmail("");
        } catch (err) {
            toast.error("Failed to share document");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnshare = async (targetEmail: string) => {
        try {
            await unshare({ id: documentId, email: targetEmail });
            toast.success(`Removed access for ${targetEmail}`);
        } catch (err) {
            toast.error("Failed to revoke access");
        }
    };

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

                {/* Sharing Form (Only visible to the owner) */}
                {isOwner ? (
                    <form onSubmit={handleShare} className="flex gap-2 mt-2">
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input
                                placeholder="Add email address..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-9 h-10 border-slate-200 focus:border-blue-500 rounded-lg text-sm"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 h-10 shrink-0"
                        >
                            Share
                        </Button>
                    </form>
                ) : (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200/60 rounded-xl mt-2 select-none">
                        <ShieldAlert className="size-4 text-amber-600 shrink-0" />
                        <span className="text-xs text-amber-700 font-medium">
                            Only the owner can share or modify collaborator access.
                        </span>
                    </div>
                )}

                {/* Shared list */}
                <div className="mt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        People with access
                    </h4>

                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                        {/* Owner item */}
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                            <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-slate-700 truncate">
                                    {isOwner ? "You" : "Document Owner"}
                                </span>
                                <span className="text-xs text-slate-400 truncate">
                                    Owner
                                </span>
                            </div>
                        </div>

                        {/* Shared list items */}
                        {sharedEmails.map((sharedEmail) => (
                            <div
                                key={sharedEmail}
                                className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl text-sm hover:bg-slate-50 transition"
                            >
                                <span className="font-medium text-slate-600 truncate mr-2">
                                    {sharedEmail}
                                </span>
                                {isOwner && (
                                    <button
                                        onClick={() => handleUnshare(sharedEmail)}
                                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition cursor-pointer"
                                        title="Revoke access"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {sharedEmails.length === 0 && (
                            <div className="text-center text-xs text-slate-400 py-4 select-none">
                                Document is private. Shared with no one.
                            </div>
                        )}
                    </div>
                </div>

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
