import { Dashboard } from "@/modules/home/components/dashboard/dashboard";
import { HomeLiveblocksProvider } from "@/providers/home-liveblocks-provider";
import { auth } from "@clerk/nextjs/server";
import { LandingPage } from "@/modules/home/components/landing/landing-page";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const { userId } = await auth();

    if (!userId) {
        return <LandingPage />;
    }

    return (
        <HomeLiveblocksProvider>
            <div className="flex min-h-screen flex-col bg-[#f4f5f8]">
                <Dashboard />
            </div>
        </HomeLiveblocksProvider>
    );
}
