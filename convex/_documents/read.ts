import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { assertCanViewDocument } from "../_utils/auth";

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
            // Paginate using Convex search index instead of collecting all documents
            const paginatedResults = organizationId
                ? await ctx.db
                      .query("documents")
                      .withSearchIndex("by_title", (q) =>
                          q.search("title", search!).eq("organizationId", organizationId),
                      )
                      .paginate(paginationOpts)
                : await ctx.db
                      .query("documents")
                      .withSearchIndex("by_title", (q) =>
                          q.search("title", search!).eq("ownerId", user.subject),
                      )
                      .paginate(paginationOpts);

            // Apply in-memory filters for folderId and onlyStarred to the current page
            const filteredPage = paginatedResults.page.filter(doc => {
                if (onlyStarred && !doc.isStarred) return false;
                if (!onlyStarred && doc.folderId !== folderId) return false;
                return true;
            });

            return {
                ...paginatedResults,
                page: filteredPage,
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
                // Relational lookup in the 'shares' table instead of a full documents table scan
                const shares = await ctx.db
                    .query("shares")
                    .withIndex("by_email", (q) => q.eq("email", emailToCheck))
                    .collect();

                const sharedDocs = [];
                for (const share of shares) {
                    const doc = await ctx.db.get(share.documentId);
                    // Ensure the document exists, user doesn't own it (already in personal list), and it fits root drive layout
                    if (doc && doc.ownerId !== user.subject && !doc.folderId) {
                        sharedDocs.push(doc);
                    }
                }
                
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
        // Enforce proper authorization check
        return await assertCanViewDocument(ctx, id);
    },
});

export const getByIds = query({
    args: { ids: v.array(v.id("documents")) },
    handler: async (ctx, { ids }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            return [];
        }

        const documents = [];

        for (const id of ids) {
            const document = await ctx.db.get(id);
            if (document) {
                // Check authorization per document
                const isOwner = document.ownerId === user.subject;
                const isMember = document.organizationId && user.org_id
                    ? document.organizationId === user.org_id
                    : false;
                const userEmail = user.email?.toLowerCase();
                const isShared = userEmail && document.sharedEmails
                    ? document.sharedEmails.some((email) => email.toLowerCase() === userEmail)
                    : false;

                if (isOwner || isMember || isShared) {
                    documents.push({ id: document._id, name: document.title });
                } else {
                    documents.push({ id, name: "[Private]" });
                }
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
