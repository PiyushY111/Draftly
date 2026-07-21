"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import stc from "string-to-color";
import { User } from "../types";

export async function getUsers() {
    const { sessionClaims } = await auth();
    const clerk = await clerkClient();

    const response = await clerk.users.getUserList({
        organizationId: [sessionClaims?.org_id as string],
    });

    const users: Map<string, User> = response.data.reduce((acc, user) => {
        const name =
            user.fullName || user.emailAddresses[0].emailAddress || "Anonymous";

        acc.set(user.id, {
            id: user.id,
            name,
            avatar: user.imageUrl,
            color: stc(`${name} dark`),
        });

        return acc;
    }, new Map());

    return users;
}
