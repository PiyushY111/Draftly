import { FullscreenLoader } from "@/components/fullscreen-loader";

export default async function LoadingDocumentPage() {
    return <FullscreenLoader label="Document loading..." />;
}
