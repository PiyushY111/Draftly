"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { getUsers } from "@/modules/room/actions/get-users";

export function HomeLiveblocksProvider({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider
            authEndpoint={async () => {
                const response = await fetch("/api/liveblocks-auth", {
                    method: "POST",
                    body: JSON.stringify({}),
                });
                return await response.json();
            }}
            throttle={16}
            resolveUsers={async ({ userIds }) => {
                const users = await getUsers();
                return userIds.map((id) => users.get(id));
            }}
        >
            {children}
        </LiveblocksProvider>
    );
}
