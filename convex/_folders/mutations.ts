import { ConvexError, v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { assertCanEditFolder, assertCanViewFolder } from "../_utils/auth";

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

        if (parentFolderId) {
            await assertCanViewFolder(ctx, parentFolderId);
        }

        return await ctx.db.insert("folders", {
            name,
            parentFolderId,
            ownerId: user.subject,
            organizationId: organizationId ?? undefined,
        });
    },
});

export const rename = mutation({
    args: { id: v.id("folders"), name: v.string() },
    handler: async (ctx, { id, name }) => {
        await assertCanEditFolder(ctx, id);
        await ctx.db.patch(id, { name });
    },
});

export const remove = mutation({
    args: { id: v.id("folders") },
    handler: async (ctx, { id }) => {
        await assertCanEditFolder(ctx, id);

        // Delete the parent folder instantly so it disappears from UI
        await ctx.db.delete(id);

        // Schedule recursive cleanup in the background
        await ctx.scheduler.runAfter(0, internal.folders.deleteFolderContentsBatch, {
            foldersToCleanup: [id],
        });
    },
});

export const deleteFolderContentsBatch = internalMutation({
    args: {
        foldersToCleanup: v.array(v.id("folders")),
    },
    handler: async (ctx, { foldersToCleanup }) => {
        if (foldersToCleanup.length === 0) {
            return;
        }

        const currentFolderId = foldersToCleanup[0];

        // 1. Delete documents in the current folder
        const docs = await ctx.db
            .query("documents")
            .withIndex("by_folder_id", (q) => q.eq("folderId", currentFolderId))
            .take(30);

        if (docs.length > 0) {
            for (const doc of docs) {
                // Delete related shares
                const shares = await ctx.db
                    .query("shares")
                    .withIndex("by_document_id", (q) => q.eq("documentId", doc._id))
                    .collect();
                for (const share of shares) {
                    await ctx.db.delete(share._id);
                }

                // Delete related revisions
                const revisions = await ctx.db
                    .query("revisions")
                    .withIndex("by_document_id", (q) => q.eq("documentId", doc._id))
                    .collect();
                for (const rev of revisions) {
                    await ctx.db.delete(rev._id);
                }

                await ctx.db.delete(doc._id);
            }
            await ctx.scheduler.runAfter(0, internal.folders.deleteFolderContentsBatch, {
                foldersToCleanup,
            });
            return;
        }

        // 2. Find subfolders
        const subfolders = await ctx.db
            .query("folders")
            .withIndex("by_parent_folder_id", (q) => q.eq("parentFolderId", currentFolderId))
            .take(30);

        if (subfolders.length > 0) {
            const subfolderIds = subfolders.map((sub) => sub._id);
            for (const sub of subfolders) {
                await ctx.db.delete(sub._id);
            }

            const nextQueue = [...subfolderIds, ...foldersToCleanup];

            await ctx.scheduler.runAfter(0, internal.folders.deleteFolderContentsBatch, {
                foldersToCleanup: nextQueue,
            });
            return;
        }

        // 3. Current folder is empty. Delete it.
        const folder = await ctx.db.get(currentFolderId);
        if (folder) {
            await ctx.db.delete(currentFolderId);
        }

        const remainingQueue = foldersToCleanup.slice(1);
        if (remainingQueue.length > 0) {
            await ctx.scheduler.runAfter(0, internal.folders.deleteFolderContentsBatch, {
                foldersToCleanup: remainingQueue,
            });
        }
    },
});
