import { liveblocks } from "@/lib/liveblocks";
import { getAuthToken } from "@/modules/document/hooks/get-auth-token";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: Request) {
    try {
        const { recipientEmail, baseDocumentId } = await request.json();

        if (!recipientEmail || !baseDocumentId) {
            return new Response("Missing required fields", { status: 400 });
        }

        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const user = await currentUser();
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const token = await getAuthToken();
        const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        if (token) {
            client.setAuth(token);
        }

        const document = await client.query(api.documents.get, { id: baseDocumentId });
        if (!document) {
            return new Response("Document not found", { status: 404 });
        }

        if (document.ownerId !== userId) {
            return new Response("Forbidden", { status: 403 });
        }

        const normalizedRecipientEmail = recipientEmail.trim().toLowerCase();
        const isShared = document.sharedEmails?.some(
            (email) => email.toLowerCase() === normalizedRecipientEmail
        );
        if (!isShared) {
            return new Response("Recipient is not a collaborator on this document", { status: 400 });
        }

        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({
            emailAddress: [normalizedRecipientEmail],
        });

        const targetUser = users.data[0];
        if (targetUser) {
            console.log(`[Share Notification] Triggering Liveblocks notification for user: ${targetUser.id}`);
            
            const docTitle = document.title;
            const ownerName = user.fullName || user.emailAddresses[0]?.emailAddress || "Someone";
            
            const origin = request.headers.get("origin") || "http://localhost:3000";
            const docUrl = `${origin}/documents/${document._id}`;

            await liveblocks.triggerInboxNotification({
                userId: targetUser.id,
                kind: "$documentShared",
                subjectId: baseDocumentId,
                activityData: {
                    docTitle,
                    docUrl,
                    ownerName,
                },
            });
        } else {
            console.log(`[Share Notification] Recipient email ${recipientEmail} is not registered with Clerk yet. Skipping notification.`);
        }

        return new Response("Success", { status: 200 });
    } catch (error) {
        console.error("[Share Notification API Error]:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
