import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

export type OrganizationId = string | null;
export enum Role {
    Admin = "org:admin",
    Member = "org:member",
}

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
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const document = await ctx.db.get(id);

        if (!document) {
            throw new ConvexError("Document not found");
        }

        if (user.subject !== document.ownerId && user.role !== Role.Admin) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.delete(id);
    },
});

export const update = mutation({
    args: { id: v.id("documents"), title: v.optional(v.string()) },
    handler: async (ctx, { id, title }) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const document = await ctx.db.get(id);

        if (!document) {
            throw new ConvexError("Document not found");
        }

        const { ownerId, organizationId } = document;

        if (ownerId !== user.subject && organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.patch(id, { title });
    },
});

export const toggleStar = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, { id }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.patch(id, { isStarred: !document.isStarred });
    },
});

export const moveToFolder = mutation({
    args: { id: v.id("documents"), folderId: v.optional(v.id("folders")) },
    handler: async (ctx, { id, folderId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.patch(id, { folderId });
    },
});
