import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { assertCanEditDocument } from "../_utils/auth";

export const addTab = mutation({
    args: { id: v.id("documents"), title: v.string(), roomId: v.string() },
    handler: async (ctx, { id, title, roomId }) => {
        const document = await assertCanEditDocument(ctx, id);

        const tabs = document.tabs || [];
        tabs.push({ id: roomId, title, roomId });

        await ctx.db.patch(id, { tabs });
    },
});

export const renameTab = mutation({
    args: { id: v.id("documents"), tabId: v.string(), title: v.string() },
    handler: async (ctx, { id, tabId, title }) => {
        const document = await assertCanEditDocument(ctx, id);

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
        const document = await assertCanEditDocument(ctx, id);

        const tabs = document.tabs || [];
        const updatedTabs = tabs.filter(t => t.id !== tabId);

        await ctx.db.patch(id, { tabs: updatedTabs });
    },
});
