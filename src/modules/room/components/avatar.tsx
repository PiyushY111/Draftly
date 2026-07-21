import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

type Props = {
    src: string;
    name: string;
    className?: HTMLAttributes<HTMLDivElement>["className"];
};

export const Avatar = ({ src, name, className }: Props) => {
    return (
        <div
            className={cn(
                "group relative -ml-2 flex size-9 shrink-0 place-content-center rounded-full border-4 border-white bg-gray-400",
                className,
            )}
        >
            <div className="absolute top-full z-10 mt-2.5 rounded-sm bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {name}
            </div>
            <Image
                width={36}
                height={36}
                alt={name}
                src={src}
                className="size-full rounded-full"
            />
        </div>
    );
};
