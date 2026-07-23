import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createRevision = mutation({
    args: { documentId: v.id("documents"), content: v.string(), title: v.string() },
    handler: async (ctx, { documentId, content, title }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(documentId);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        return await ctx.db.insert("revisions", {
            documentId,
            content,
            title,
            createdBy: user.subject,
            createdByName: user.name || user.email || "Anonymous",
            createdAt: Date.now(),
        });
    },
});

export const getRevisions = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, { documentId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) return [];

        const document = await ctx.db.get(documentId);
        if (!document) return [];

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            return [];
        }

        return await ctx.db
            .query("revisions")
            .withIndex("by_document_id", (q) => q.eq("documentId", documentId))
            .order("desc")
            .collect();
    },
});

export const restoreRevision = mutation({
    args: { documentId: v.id("documents"), revisionId: v.id("revisions") },
    handler: async (ctx, { documentId, revisionId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(documentId);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        const revision = await ctx.db.get(revisionId);
        if (!revision || revision.documentId !== documentId) {
            throw new ConvexError("Revision not found");
        }

        await ctx.db.patch(documentId, { initialContent: revision.content });
    },
});
