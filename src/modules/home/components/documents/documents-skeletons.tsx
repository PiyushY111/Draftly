"use client";
import { Skeleton, TableBody, TableCell, TableRow } from "@/components/ui";



export const DocumentCardsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-2xl" />
            ))}
        </div>
    );
};

export const DocumentTableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                    <TableCell colSpan={4}>
                        <Skeleton className="h-8" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};
