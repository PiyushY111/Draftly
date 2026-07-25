import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { assertCanEditDocument, assertIsDocumentOwner, assertCanViewFolder } from "../_utils/auth";

export type OrganizationId = string | null;

export const create = mutation({
    args: {
        title: v.optional(v.string()),
        initialContent: v.optional(v.string()),
        folderId: v.optional(v.id("folders")),
    },
    handler: async (
        ctx,
        { title = "Untitled document", initialContent = "", folderId },
    ) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const organizationId = user.org_id as OrganizationId;

        if (folderId) {
            await assertCanViewFolder(ctx, folderId);
        }

        return await ctx.db.insert("documents", {
            title,
            initialContent,
            ownerId: user.subject,
            organizationId: organizationId ?? undefined,
            folderId,
        });
    },
});

export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, { id }) => {
        await assertIsDocumentOwner(ctx, id);

        // Delete any related shares mapping records
        const shares = await ctx.db
            .query("shares")
            .withIndex("by_document_id", (q) => q.eq("documentId", id))
            .collect();
        for (const share of shares) {
            await ctx.db.delete(share._id);
        }

        // Delete any related revisions
        const revisions = await ctx.db
            .query("revisions")
            .withIndex("by_document_id", (q) => q.eq("documentId", id))
            .collect();
        for (const rev of revisions) {
            await ctx.db.delete(rev._id);
        }

        await ctx.db.delete(id);
    },
});

export const update = mutation({
    args: { id: v.id("documents"), title: v.optional(v.string()) },
    handler: async (ctx, { id, title }) => {
        await assertCanEditDocument(ctx, id);
        await ctx.db.patch(id, { title });
    },
});

export const toggleStar = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, { id }) => {
        const document = await assertCanEditDocument(ctx, id);
        await ctx.db.patch(id, { isStarred: !document.isStarred });
    },
});

export const moveToFolder = mutation({
    args: { id: v.id("documents"), folderId: v.optional(v.id("folders")) },
    handler: async (ctx, { id, folderId }) => {
        await assertCanEditDocument(ctx, id);
        if (folderId) {
            await assertCanViewFolder(ctx, folderId);
        }
        await ctx.db.patch(id, { folderId });
    },
});
