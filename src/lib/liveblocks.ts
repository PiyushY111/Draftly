import "server-only";

import { Liveblocks } from "@liveblocks/node";

const secretKey = process.env.LIVEBLOCKS_SECRET_KEY || process.env.LIVEBLOCK_SECRET_KEY;

if (!secretKey) {
    throw new Error("Missing Liveblocks secret key. Please set LIVEBLOCKS_SECRET_KEY or LIVEBLOCK_SECRET_KEY in your environment variables.");
}

export const liveblocks = new Liveblocks({
    secret: secretKey,
});
