import { convex } from "@/lib/convex";
import { liveblocks } from "@/lib/liveblocks";
import { auth, currentUser } from "@clerk/nextjs/server";
import stc from "string-to-color";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: Request) {
    try {
        const { sessionClaims } = await auth();

        if (!sessionClaims) {
            return new Response("Unauthorized", { status: 401 });
        }

        const user = await currentUser();

        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const room = body?.room;

        if (room) {
            const baseDocumentId = room.split("-tab-")[0];
            const document = await convex.query(api.documents.get, { id: baseDocumentId });

            if (!document) {
                return new Response("Not found", { status: 404 });
            }

            const isOwner = document.ownerId === user.id;
            const isMember = document.organizationId && sessionClaims.org_id
                ? document.organizationId === String(sessionClaims.org_id)
                : false;
            
            const userEmails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
            const isShared = document.sharedEmails?.some((email) =>
                userEmails.includes(email.toLowerCase())
            );

            if (!isOwner && !isMember && !isShared) {
                return new Response("Unauthorized", { status: 401 });
            }
        }

        const name =
            user.fullName || user.emailAddresses[0]?.emailAddress || "Anonymous";
        const session = liveblocks.prepareSession(user.id, {
            userInfo: {
                name,
                avatar: user.imageUrl,
                color: stc(`${name} dark`),
            },
        });

        if (room) {
            session.allow(room, session.FULL_ACCESS);
        }
        const { status, body: authBody } = await session.authorize();

        return new Response(authBody, { status });
    } catch (error) {
        console.error("[Liveblocks Auth Route Error]:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
