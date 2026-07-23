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
