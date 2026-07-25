import { mutation } from "./_generated/server";

export const backfillShares = mutation({
    args: {},
    handler: async (ctx) => {
        const documents = await ctx.db.query("documents").collect();
        let createdCount = 0;

        for (const doc of documents) {
            const sharedEmails = doc.sharedEmails || [];
            for (const email of sharedEmails) {
                const trimmedEmail = email.trim().toLowerCase();
                if (!trimmedEmail) continue;

                const existing = await ctx.db
                    .query("shares")
                    .withIndex("by_email", (q) => q.eq("email", trimmedEmail))
                    .filter((q) => q.eq(q.field("documentId"), doc._id))
                    .first();

                if (!existing) {
                    await ctx.db.insert("shares", {
                        documentId: doc._id,
                        email: trimmedEmail,
                    });
                    createdCount++;
                }
            }
        }

        return {
            status: "success",
            processedDocuments: documents.length,
            createdShares: createdCount,
        };
    },
});
