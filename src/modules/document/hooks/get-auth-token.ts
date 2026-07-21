import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
    const { getToken } = await auth();
    const token = getToken({ template: "convex" }) ?? undefined;

    return token;
}
