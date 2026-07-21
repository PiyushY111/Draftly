"use client";

import { ClerkProvider, SignIn, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

import { FullscreenLoader } from "@/components/fullscreen-loader";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
        },
    },
});
convexQueryClient.connect(queryClient);

export function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <QueryClientProvider client={queryClient}>
                    <Authenticated>{children}</Authenticated>
                    <Unauthenticated>
                        <div className="flex min-h-screen flex-col items-center justify-center">
                            <SignIn routing="hash" />
                        </div>
                    </Unauthenticated>
                    <AuthLoading>
                        <FullscreenLoader label="Auth loading..." />
                    </AuthLoading>
                </QueryClientProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
