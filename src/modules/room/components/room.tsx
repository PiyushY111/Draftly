"use client";

import { FullscreenLoader } from "@/components/fullscreen-loader";
import {
    ClientSideSuspense,
    LiveblocksProvider,
    RoomProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { getDocuments } from "../actions/get-documents";
import { getUsers } from "../actions/get-users";

type Props = {
    documentId: string;
    roomId: string;
    children: ReactNode;
};

export function Room({ documentId, roomId, children }: Props) {
    return (
        <LiveblocksProvider
            authEndpoint={async () => {
                const response = await fetch("/api/liveblocks-auth", {
                    method: "POST",
                    body: JSON.stringify({ room: roomId }),
                });

                return await response.json();
            }}
            throttle={16}
            resolveUsers={async ({ userIds }) => {
                const users = await getUsers();
                return userIds.map((id) => users.get(id));
            }}
            resolveMentionSuggestions={async ({ text }) => {
                const mapUsers = await getUsers();
                let users = Array.from(mapUsers.values());

                if (text) {
                    users = users.filter((user) =>
                        user.name.toLowerCase().includes(text.toLowerCase()),
                    );
                }
                return users.map((user) => user.id);
            }}
            resolveRoomsInfo={async ({ roomIds }) => {
                return await getDocuments(roomIds as Id<"documents">[]);
            }}
        >
            <RoomProvider
                id={roomId}
                initialStorage={{
                    leftPadding: 56,
                    rightPadding: 56,
                }}
            >
                <ClientSideSuspense
                    fallback={<FullscreenLoader label="Document loading..." />}
                >
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}
