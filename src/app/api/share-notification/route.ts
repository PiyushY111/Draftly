import { liveblocks } from "@/lib/liveblocks";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { recipientEmail, docTitle, docUrl, ownerName, baseDocumentId } = await request.json();

        if (!recipientEmail || !docTitle || !docUrl || !ownerName || !baseDocumentId) {
            return new Response("Missing required fields", { status: 400 });
        }

        const client = await clerkClient();
        const users = await client.users.getUserList({
            emailAddress: [recipientEmail],
        });

        const targetUser = users.data[0];
        if (targetUser) {
            console.log(`[Share Notification] Triggering Liveblocks notification for user: ${targetUser.id}`);
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
