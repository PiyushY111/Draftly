"use client";
import { Button, Input } from "@/components/ui";


import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, ShieldAlert } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";

type Props = {
    documentId: Id<"documents">;
    documentTitle: string;
    isOwner: boolean;
    ownerName: string;
};

export const ShareForm = ({ documentId, documentTitle, isOwner, ownerName }: Props) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const share = useMutation(api.documents.share);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetEmail = email.trim().toLowerCase();
        if (!targetEmail) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(targetEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        try {
            await share({ id: documentId, email: targetEmail });
            
            const docUrl = `${window.location.origin}/documents/${documentId}`;
            await fetch("/api/share-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientEmail: targetEmail,
                    docTitle: documentTitle,
                    docUrl,
                    ownerName,
                    baseDocumentId: documentId,
                }),
            });

            toast.success(`Access shared with ${targetEmail}!`);
            setEmail("");
        } catch {
            toast.error("Failed to share document");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOwner) {
        return (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200/60 rounded-xl mt-2 select-none">
                <ShieldAlert className="size-4 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-700 font-medium">
                    Only the owner can share or modify collaborator access.
                </span>
            </div>
        );
    }

    return (
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
    );
};
