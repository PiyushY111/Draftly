"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-6">
            <div className="space-y-4 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-rose-100 p-3">
                        <AlertTriangle className="size-10 text-rose-600" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Something went wrong
                    </h2>
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <Button onClick={reset} className="font-medium">
                    Try again
                </Button>
                <Button variant="secondary" className="font-medium" asChild>
                    <Link href="/">Go back</Link>
                </Button>
            </div>
        </div>
    );
}
