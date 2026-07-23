import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";

export type OrganizationId = string | null;

export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
        search: v.optional(v.string()),
        folderId: v.optional(v.id("folders")),
        onlyStarred: v.optional(v.boolean()),
        userEmail: v.optional(v.string()),
    },
    handler: async (ctx, { paginationOpts, search, folderId, onlyStarred, userEmail }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const organizationId = user.org_id as OrganizationId;

        if (search) {
            const results = organizationId
                ? await ctx.db
                      .query("documents")
                      .withSearchIndex("by_title", (q) =>
                          q.search("title", search!).eq("organizationId", organizationId),
                      )
                      .collect()
                : await ctx.db
                      .query("documents")
                      .withSearchIndex("by_title", (q) =>
                          q.search("title", search!).eq("ownerId", user.subject),
                      )
                      .collect();
            const filtered = results.filter(doc => {
                if (onlyStarred && !doc.isStarred) return false;
                if (!onlyStarred && doc.folderId !== folderId) return false;
                return true;
            });

            const start = paginationOpts.numItems * (parseInt(paginationOpts.cursor || "0") || 0);
            const paginated = filtered.slice(start, start + paginationOpts.numItems);
            const hasMore = start + paginationOpts.numItems < filtered.length;
            const nextCursor = hasMore ? String((parseInt(paginationOpts.cursor || "0") || 0) + 1) : null;
            
            return {
                page: paginated,
                isDone: !hasMore,
                continueCursor: nextCursor || "",
            };
        }

        const q = organizationId
            ? ctx.db
                  .query("documents")
                  .withIndex("by_organization_id", (q) =>
                      q.eq("organizationId", organizationId),
                  )
            : ctx.db
                  .query("documents")
                  .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject));

        const filteredQ = q.filter((q) => {
            let expr = q.eq(q.field("ownerId"), user.subject);
            if (organizationId) {
                expr = q.eq(q.field("organizationId"), organizationId);
            }

            if (onlyStarred) {
                return q.and(expr, q.eq(q.field("isStarred"), true));
            } else {
                return q.and(expr, q.eq(q.field("folderId"), folderId));
            }
        });

        const paginatedResults = await filteredQ.order("desc").paginate(paginationOpts);

        // Fetch shared documents at the root level of drive listing
        if (!onlyStarred && !folderId) {
            const emailToCheck = (userEmail || user.email)?.toLowerCase();
            if (emailToCheck) {
                const allDocs = await ctx.db.query("documents").collect();
                const sharedDocs = allDocs.filter(doc => 
                    doc.ownerId !== user.subject &&
                    doc.sharedEmails?.map(e => e.toLowerCase()).includes(emailToCheck)
                );
                
                const merged = [...paginatedResults.page, ...sharedDocs];
                merged.sort((a, b) => b._creationTime - a._creationTime);
                
                return {
                    ...paginatedResults,
                    page: merged,
                };
            }
        }

        return paginatedResults;
    },
});

export const get = query({
    args: { id: v.id("documents") },
    handler: async (ctx, { id }) => {
        const document = await ctx.db.get(id);

        if (!document) {
            throw new ConvexError("Document not found");
        }

        return document;
    },
});

export const getByIds = query({
    args: { ids: v.array(v.id("documents")) },
    handler: async (ctx, { ids }) => {
        const documents = [];

        for (const id of ids) {
            const document = await ctx.db.get(id);
            if (document) {
                documents.push({ id: document._id, name: document.title });
            } else {
                documents.push({ id, name: "[Removed]" });
            }
        }
        return documents;
    },
});

export const getSuggestions = query({
    args: { search: v.string() },
    handler: async (ctx, { search }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            return [];
        }

        const organizationId = user.org_id as OrganizationId;

        if (search) {
            if (organizationId) {
                return await ctx.db
                    .query("documents")
                    .withSearchIndex("by_title", (q) =>
                        q.search("title", search).eq("organizationId", organizationId),
                    )
                    .take(5);
            }

            return await ctx.db
                .query("documents")
                .withSearchIndex("by_title", (q) =>
                    q.search("title", search).eq("ownerId", user.subject),
                )
                .take(5);
        }

        if (organizationId) {
            return await ctx.db
                .query("documents")
                .withIndex("by_organization_id", (q) =>
                    q.eq("organizationId", organizationId),
                )
                .order("desc")
                .take(5);
        }

        return await ctx.db
            .query("documents")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
            .order("desc")
            .take(5);
    },
});
