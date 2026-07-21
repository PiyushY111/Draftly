import { Document } from "@/modules/document/components/document";
import { getAuthToken } from "@/modules/document/hooks/get-auth-token";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
    params: Promise<{ documentId: Id<"documents"> }>;
};

export default async function DocumentPage({ params }: Props) {
    const { documentId } = await params;

    const token = await getAuthToken();

    if (!token) {
        throw new Error("Unauthorized");
    }

    const preloadedDocument = await preloadQuery(
        api.documents.get,
        { id: documentId },
        { token },
    );

    if (!preloadedDocument) {
        throw new Error("Document not found");
    }

    return <Document preloadedDocument={preloadedDocument} />;
}
