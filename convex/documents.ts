import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export type OrganizationId = string | null;
export enum Role {
    Admin = "org:admin",
    Member = "org:member",
}

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

export const addTab = mutation({
    args: { id: v.id("documents"), title: v.string(), roomId: v.string() },
    handler: async (ctx, { id, title, roomId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        const tabs = document.tabs || [];
        tabs.push({ id: roomId, title, roomId });

        await ctx.db.patch(id, { tabs });
    },
});

export const renameTab = mutation({
    args: { id: v.id("documents"), tabId: v.string(), title: v.string() },
    handler: async (ctx, { id, tabId, title }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        const tabs = document.tabs || [];
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            tab.title = title;
        }

        await ctx.db.patch(id, { tabs });
    },
});

export const removeTab = mutation({
    args: { id: v.id("documents"), tabId: v.string() },
    handler: async (ctx, { id, tabId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new ConvexError("Unauthorized");

        const document = await ctx.db.get(id);
        if (!document) throw new ConvexError("Document not found");

        if (document.ownerId !== user.subject && document.organizationId !== user.org_id) {
            throw new ConvexError("Unauthorized");
        }

        const tabs = document.tabs || [];
        const updatedTabs = tabs.filter(t => t.id !== tabId);

        await ctx.db.patch(id, { tabs: updatedTabs });
    },
});

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

        await ctx.db.patch(id, { sharedEmails });
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

export const sendShareEmail = action({
    args: {
        email: v.string(),
        docTitle: v.string(),
        docUrl: v.string(),
        ownerName: v.string(),
    },
    handler: async (ctx, { email, docTitle, docUrl, ownerName }) => {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.log(`[Resend Mock Email]:
To: ${email}
Subject: ${ownerName} shared a document with you: "${docTitle}"
Body: Click the link to view the document: ${docUrl}`);
            return;
        }

        try {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Draftly <onboarding@resend.dev>",
                    to: email,
                    subject: `${ownerName} shared a document with you: "${docTitle}"`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; margin: 0 auto;">
                            <h2 style="color: #1e3a8a; margin-top: 0;">Document Shared with You</h2>
                            <p><strong>${ownerName}</strong> has shared a collaborative document with you on Draftly.</p>
                            <div style="margin: 25px 0;">
                                <a href="${docUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    Open "${docTitle}"
                                </a>
                            </div>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p style="color: #64748b; font-size: 12px;">If you didn't expect this email, you can safely ignore it.</p>
                        </div>
                    `,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Resend API error: ${errText}`);
            }
            
            console.log(`[Resend Email Sent] Successfully sent sharing notification to ${email}`);
        } catch (error) {
            console.error("[Resend Email Error]:", error);
            throw new ConvexError("Failed to send share email notification");
        }
    },
});

