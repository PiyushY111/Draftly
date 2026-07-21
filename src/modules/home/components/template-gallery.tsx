"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn, handleError } from "@/lib/utils";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { TEMPLATES } from "../constants";

export const TemplateGallery = () => {
    const { mutate, isPending: isCreating } = useMutation({
        mutationFn: useConvexMutation(api.documents.create),
    });

    const router = useRouter();

    const create = async (title: string, initialContent: string) => {
        mutate(
            { title, initialContent },
            {
                onSuccess(id) {
                    router.push(`/documents/${id}`);
                },
                onError(error) {
                    handleError(error);
                },
            },
        );
    };

    return (
        <div className="bg-[#f1f3f4]">
            <div className="mx-auto flex max-w-6xl flex-col gap-y-4 px-16 py-6">
                <h3 className="font-medium">Start a new document</h3>
                <Carousel>
                    <CarouselContent className="-ml-4">
                        {TEMPLATES.map((template) => (
                            <CarouselItem
                                key={template.id}
                                className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
                            >
                                <div
                                    className={cn(
                                        "flex aspect-[3/4] flex-col gap-y-2.5",
                                        isCreating &&
                                            "pointer-events-none opacity-50",
                                    )}
                                >
                                    <button
                                        style={{
                                            backgroundImage: `url(${template.imageUrl})`,
                                        }}
                                        className="flex size-full cursor-pointer flex-col items-center justify-center gap-y-4 rounded-sm border bg-white bg-cover bg-center bg-no-repeat transition hover:border-blue-500 hover:bg-blue-50"
                                        disabled={isCreating}
                                        onClick={() =>
                                            create(
                                                template.label,
                                                template.initialContent,
                                            )
                                        }
                                    />
                                    <p className="truncate text-sm font-medium">
                                        {template.label}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
};
