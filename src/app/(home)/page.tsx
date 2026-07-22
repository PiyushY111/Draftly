import { Dashboard } from "@/modules/home/components/dashboard";
import { Navbar } from "@/modules/home/components/navbar";
import { HomeLiveblocksProvider } from "@/providers/home-liveblocks-provider";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafbfd]">
                <SignIn routing="hash" />
            </div>
        );
    }

    return (
        <HomeLiveblocksProvider>
            <div className="flex min-h-screen flex-col h-screen overflow-hidden">
                <div className="fixed inset-x-0 top-0 z-50 h-16 bg-white border-b border-slate-200/80">
                    <Navbar />
                </div>
                <div className="flex flex-1 pt-16 min-h-0 overflow-hidden">
                    <Dashboard />
                </div>
            </div>
        </HomeLiveblocksProvider>
    );
}
