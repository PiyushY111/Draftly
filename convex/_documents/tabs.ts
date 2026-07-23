import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

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
