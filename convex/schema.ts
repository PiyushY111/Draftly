import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        initialContent: v.optional(v.string()),
        ownerId: v.string(),
        roomId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        folderId: v.optional(v.id("folders")),
        isStarred: v.optional(v.boolean()),
        tabs: v.optional(
            v.array(
                v.object({
                    id: v.string(),
                    title: v.string(),
                    roomId: v.string(),
                })
            )
        ),
        sharedEmails: v.optional(v.array(v.string())),
    })
        .index("by_owner_id", ["ownerId"])
        .index("by_organization_id", ["organizationId"])
        .index("by_folder_id", ["folderId"])
        .searchIndex("by_title", {
            searchField: "title",
            filterFields: ["ownerId", "organizationId"],
        }),

    folders: defineTable({
        name: v.string(),
        parentFolderId: v.optional(v.id("folders")),
        ownerId: v.string(),
        organizationId: v.optional(v.string()),
    })
        .index("by_owner_id", ["ownerId"])
        .index("by_organization_id", ["organizationId"])
        .index("by_parent_folder_id", ["parentFolderId"]),

    revisions: defineTable({
        documentId: v.id("documents"),
        content: v.string(),
        title: v.string(),
        createdBy: v.string(),
        createdByName: v.string(),
        createdAt: v.number(),
    })
        .index("by_document_id", ["documentId"]),
});
