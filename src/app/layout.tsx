import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@liveblocks/react-tiptap/styles.css";
import "@liveblocks/react-ui/styles.css";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { EditorStoreProvider } from "@/providers/editor-store-provider";
import { QueryProvider } from "@/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Google Docs Clone",
    description: "A clone of Google Docs built with Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NuqsAdapter>
                    <QueryProvider>
                        <EditorStoreProvider>{children}</EditorStoreProvider>
                    </QueryProvider>
                </NuqsAdapter>
                <Toaster richColors theme="light" />
            </body>
        </html>
    );
}
