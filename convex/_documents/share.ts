import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { assertIsDocumentOwner } from "../_utils/auth";

export const share = mutation({
    args: { id: v.id("documents"), email: v.string() },
    handler: async (ctx, { id, email }) => {
        const targetEmail = email.trim().toLowerCase();
        if (!targetEmail) {
            throw new ConvexError("Email cannot be empty");
        }
        if (!targetEmail.includes("@")) {
            throw new ConvexError("Invalid email address");
        }

        const document = await assertIsDocumentOwner(ctx, id);

        const sharedEmails = document.sharedEmails || [];
        if (!sharedEmails.includes(targetEmail)) {
            sharedEmails.push(targetEmail);
        }

        await ctx.db.patch(id, { sharedEmails });

        const existingShare = await ctx.db
            .query("shares")
            .withIndex("by_email", (q) => q.eq("email", targetEmail))
            .filter((q) => q.eq(q.field("documentId"), id))
            .first();

        if (!existingShare) {
            await ctx.db.insert("shares", {
                documentId: id,
                email: targetEmail,
            });
        }
    },
});

export const unshare = mutation({
    args: { id: v.id("documents"), email: v.string() },
    handler: async (ctx, { id, email }) => {
        const targetEmail = email.trim().toLowerCase();
        if (!targetEmail) {
            throw new ConvexError("Email cannot be empty");
        }

        const document = await assertIsDocumentOwner(ctx, id);

        const sharedEmails = document.sharedEmails || [];
        const updated = sharedEmails.filter((e) => e.toLowerCase() !== targetEmail);

        await ctx.db.patch(id, { sharedEmails: updated });

        const existingShare = await ctx.db
            .query("shares")
            .withIndex("by_email", (q) => q.eq("email", targetEmail))
            .filter((q) => q.eq(q.field("documentId"), id))
            .first();

        if (existingShare) {
            await ctx.db.delete(existingShare._id);
        }
    },
});
