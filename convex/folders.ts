import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export type OrganizationId = string | null;

export const create = mutation({
    args: {
        name: v.string(),
        parentFolderId: v.optional(v.id("folders")),
    },
    handler: async (ctx, { name, parentFolderId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const organizationId = user.org_id as OrganizationId;

        return await ctx.db.insert("folders", {
            name,
            parentFolderId,
            ownerId: user.subject,
            organizationId: organizationId ?? undefined,
        });
    },
});

export const list = query({
    args: {
        parentFolderId: v.optional(v.id("folders")),
    },
    handler: async (ctx, { parentFolderId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            return [];
        }

        const organizationId = user.org_id as OrganizationId;

        if (organizationId) {
            return await ctx.db
                .query("folders")
                .withIndex("by_organization_id", (q) =>
                    q.eq("organizationId", organizationId),
                )
                .filter((q) => q.eq(q.field("parentFolderId"), parentFolderId))
                .order("desc")
                .collect();
        }

        return await ctx.db
            .query("folders")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
            .filter((q) => q.eq(q.field("parentFolderId"), parentFolderId))
            .order("desc")
            .collect();
    },
});

export const get = query({
    args: { id: v.optional(v.id("folders")) },
    handler: async (ctx, { id }) => {
        if (!id) return null;
        const folder = await ctx.db.get(id);
        if (!folder) {
            throw new ConvexError("Folder not found");
        }
        return folder;
    },
});

export const rename = mutation({
    args: { id: v.id("folders"), name: v.string() },
    handler: async (ctx, { id, name }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const folder = await ctx.db.get(id);
        if (!folder) {
            throw new ConvexError("Folder not found");
        }

        if (folder.ownerId !== user.subject) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.patch(id, { name });
    },
});

export const remove = mutation({
    args: { id: v.id("folders") },
    handler: async (ctx, { id }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const folder = await ctx.db.get(id);
        if (!folder) {
            throw new ConvexError("Folder not found");
        }

        if (folder.ownerId !== user.subject) {
            throw new ConvexError("Unauthorized");
        }

        // Recursive delete helper to clean up subfolders and documents
        const deleteFolderRecursive = async (folderId: Id<"folders">) => {
            // Delete documents in this folder
            const docs = await ctx.db
                .query("documents")
                .withIndex("by_folder_id", (q) => q.eq("folderId", folderId))
                .collect();

            for (const doc of docs) {
                await ctx.db.delete(doc._id);
            }

            // Find and delete subfolders recursively
            const subfolders = await ctx.db
                .query("folders")
                .withIndex("by_parent_folder_id", (q) => q.eq("parentFolderId", folderId))
                .collect();

            for (const sub of subfolders) {
                await deleteFolderRecursive(sub._id);
            }

            // Delete the folder itself
            await ctx.db.delete(folderId);
        };

        await deleteFolderRecursive(id);
    },
});
