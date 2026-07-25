import { Document } from "@/modules/document/components/layout/document";
import { getAuthToken } from "@/modules/document/hooks/get-auth-token";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ documentId: Id<"documents"> }>;
};

export const dynamic = "force-dynamic";

export default async function DocumentPage({ params }: Props) {
    const { documentId } = await params;

    const token = await getAuthToken();

    if (!token) {
        redirect("/");
    }

    const preloadedDocument = await preloadQuery(
        api.documents.get,
        { id: documentId },
        { token },
    );

    return <Document preloadedDocument={preloadedDocument} />;
}
