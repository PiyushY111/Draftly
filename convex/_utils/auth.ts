import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
        throw new ConvexError("Unauthorized");
    }
    return user;
}

export async function assertCanViewDocument(
    ctx: QueryCtx | MutationCtx,
    documentId: Id<"documents">
): Promise<Doc<"documents">> {
    const user = await getAuthenticatedUser(ctx);
    const document = await ctx.db.get(documentId);
    if (!document) {
        throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isMember = document.organizationId && user.org_id
        ? document.organizationId === user.org_id
        : false;

    const userEmail = user.email?.toLowerCase();
    const isShared = userEmail && document.sharedEmails
        ? document.sharedEmails.some((email) => email.toLowerCase() === userEmail)
        : false;

    if (!isOwner && !isMember && !isShared) {
        throw new ConvexError("Unauthorized");
    }

    return document;
}

export async function assertCanEditDocument(
    ctx: QueryCtx | MutationCtx,
    documentId: Id<"documents">
): Promise<Doc<"documents">> {
    // In Draftly, anyone authorized to view/collaborate is authorized to edit,
    // but only the owner can delete or manage sharing (checked separately via assertIsDocumentOwner).
    return assertCanViewDocument(ctx, documentId);
}

export async function assertIsDocumentOwner(
    ctx: QueryCtx | MutationCtx,
    documentId: Id<"documents">
): Promise<Doc<"documents">> {
    const user = await getAuthenticatedUser(ctx);
    const document = await ctx.db.get(documentId);
    if (!document) {
        throw new ConvexError("Document not found");
    }

    // Supports user.role for admin override if Clerk sets role
    const isAdmin = (user as any).role === "org:admin";
    if (document.ownerId !== user.subject && !isAdmin) {
        throw new ConvexError("Only the document owner can perform this action");
    }

    return document;
}

export async function assertCanViewFolder(
    ctx: QueryCtx | MutationCtx,
    folderId: Id<"folders">
): Promise<Doc<"folders">> {
    const user = await getAuthenticatedUser(ctx);
    const folder = await ctx.db.get(folderId);
    if (!folder) {
        throw new ConvexError("Folder not found");
    }

    const isOwner = folder.ownerId === user.subject;
    const isMember = folder.organizationId && user.org_id
        ? folder.organizationId === user.org_id
        : false;

    if (!isOwner && !isMember) {
        throw new ConvexError("Unauthorized");
    }

    return folder;
}

export async function assertCanEditFolder(
    ctx: QueryCtx | MutationCtx,
    folderId: Id<"folders">
): Promise<Doc<"folders">> {
    // Standardize folder editing permissions (matches viewing permissions for orgs/owners)
    return assertCanViewFolder(ctx, folderId);
}
