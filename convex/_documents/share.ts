import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

export const share = mutation({
    args: { id: v.id("documents"), email: v.string() },
    handler: async (ctx, { id, email }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject) {
            throw new ConvexError("Only the owner can share the document");
        }

        const sharedEmails = document.sharedEmails || [];
        const targetEmail = email.trim().toLowerCase();
        if (!sharedEmails.includes(targetEmail)) {
            sharedEmails.push(targetEmail);
        }

        await ctx.db.patch(id, { sharedEmails: targetEmail ? sharedEmails : undefined });
    },
});

export const unshare = mutation({
    args: { id: v.id("documents"), email: v.string() },
    handler: async (ctx, { id, email }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject) {
            throw new ConvexError("Only the owner can manage access");
        }

        const sharedEmails = document.sharedEmails || [];
        const updated = sharedEmails.filter((e) => e.toLowerCase() !== email.trim().toLowerCase());

        await ctx.db.patch(id, { sharedEmails: updated });
    },
});
