/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { expect, test, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

test("document lifecycle operations", async () => {
    const t = convexTest(schema, modules);

    // Mock identity for clerk auth and assign the authenticated runner
    const authenticated = t.withIdentity({
        subject: "user_123",
        name: "Test User",
        email: "test@example.com",
    });

    // 1. Create document
    const docId = await authenticated.mutation(api.documents.create, {
        title: "Test Plan",
        initialContent: "Hello world",
    });

    expect(docId).toBeDefined();

    // 2. Get document
    const doc = await authenticated.query(api.documents.get, { id: docId });
    expect(doc).toMatchObject({
        title: "Test Plan",
        initialContent: "Hello world",
        ownerId: "user_123",
    });

    // 3. List documents
    const listResult = await authenticated.query(api.documents.list, {
        paginationOpts: { numItems: 10, cursor: null },
    });
    expect(listResult.page.length).toBe(1);
    expect(listResult.page[0]._id).toBe(docId);

    // 4. Toggle star
    await authenticated.mutation(api.documents.toggleStar, { id: docId });
    const starredDoc = await authenticated.query(api.documents.get, { id: docId });
    expect(starredDoc.isStarred).toBe(true);

    // 5. Remove document
    await authenticated.mutation(api.documents.remove, { id: docId });
    await expect(authenticated.query(api.documents.get, { id: docId })).rejects.toThrow();
});

test("folder deletion cleans up nested contents", async () => {
    const t = convexTest(schema, modules);

    const authenticated = t.withIdentity({
        subject: "user_123",
        name: "Test User",
        email: "test@example.com",
    });

    // Create a parent folder
    const parentFolderId = await authenticated.mutation(api.folders.create, {
        name: "Parent Folder",
    });

    // Create a subfolder
    const subFolderId = await authenticated.mutation(api.folders.create, {
        name: "Sub Folder",
        parentFolderId,
    });

    // Create a document inside subfolder
    const docId = await authenticated.mutation(api.documents.create, {
        title: "Nested Doc",
        folderId: subFolderId,
    });

    // Verify they exist
    const docBefore = await authenticated.query(api.documents.get, { id: docId });
    expect(docBefore).toBeDefined();

    // Enable fake timers BEFORE mutation to capture scheduled job
    vi.useFakeTimers();

    // Delete parent folder
    await authenticated.mutation(api.folders.remove, { id: parentFolderId });

    // Wait for all scheduled functions to run (for background batch delete)
    await authenticated.finishAllScheduledFunctions(() => {
        vi.runAllTimers();
    });
    vi.useRealTimers();

    // Verify parent folder, subfolder, and nested document are all deleted
    await expect(authenticated.query(api.folders.get, { id: parentFolderId })).rejects.toThrow();
    await expect(authenticated.query(api.folders.get, { id: subFolderId })).rejects.toThrow();
    await expect(authenticated.query(api.documents.get, { id: docId })).rejects.toThrow();
});

test("document and folder authorization checks", async () => {
    const t = convexTest(schema, modules);

    // Mock identities
    const owner = t.withIdentity({
        subject: "user_owner",
        name: "Document Owner",
        email: "owner@example.com",
    });

    const otherUser = t.withIdentity({
        subject: "user_other",
        name: "Other User",
        email: "other@example.com",
    });

    const sharedUser = t.withIdentity({
        subject: "user_shared",
        name: "Shared User",
        email: "shared@example.com",
    });

    // 1. Owner creates a personal document (no organization)
    const docId = await owner.mutation(api.documents.create, {
        title: "Private Owner Doc",
        initialContent: "Secret info",
    });

    // 2. Assert owner can read and edit
    const docForOwner = await owner.query(api.documents.get, { id: docId });
    expect(docForOwner.title).toBe("Private Owner Doc");

    // 3. Assert other user is rejected for read (C1 fix verification)
    await expect(otherUser.query(api.documents.get, { id: docId })).rejects.toThrow();

    // 4. Assert other user is rejected for write mutations (C2 fix verification)
    await expect(otherUser.mutation(api.documents.update, { id: docId, title: "Hacked Title" })).rejects.toThrow();
    await expect(otherUser.mutation(api.documents.addTab, { id: docId, title: "Hacked Tab", roomId: "room_hack" })).rejects.toThrow();
    await expect(otherUser.mutation(api.documents.createRevision, { documentId: docId, content: "Hacked Content", title: "hack" })).rejects.toThrow();

    // 5. Owner shares document with sharedUser's email
    await owner.mutation(api.documents.share, { id: docId, email: "shared@example.com" });

    // 6. Assert sharedUser can now view and edit the document
    const docForShared = await sharedUser.query(api.documents.get, { id: docId });
    expect(docForShared.title).toBe("Private Owner Doc");

    await sharedUser.mutation(api.documents.update, { id: docId, title: "Collaborator Edit" });
    const docAfterEdit = await owner.query(api.documents.get, { id: docId });
    expect(docAfterEdit.title).toBe("Collaborator Edit");

    // 7. Owner unshares the document
    await owner.mutation(api.documents.unshare, { id: docId, email: "shared@example.com" });

    // 8. Assert sharedUser is rejected again after unsharing
    await expect(sharedUser.query(api.documents.get, { id: docId })).rejects.toThrow();
});
