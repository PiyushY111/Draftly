import { liveblocks } from "@/lib/liveblocks";
import { getAuthToken } from "@/modules/document/hooks/get-auth-token";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
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

            const token = await getAuthToken();
            const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
            if (token) {
                client.setAuth(token);
            }

            try {
                const document = await client.query(api.documents.get, { id: baseDocumentId });
                if (!document) {
                    return new Response("Not found", { status: 404 });
                }
            } catch (error) {
                console.error("[Liveblocks Auth permission check failed]:", error);
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
