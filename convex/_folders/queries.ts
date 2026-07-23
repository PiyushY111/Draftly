import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";

export type OrganizationId = string | null;

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
