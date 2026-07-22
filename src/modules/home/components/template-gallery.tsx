"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
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
    const [isExpanded, setIsExpanded] = useState(true);

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
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm transition-all">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        <h3 className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
                            Start a new document
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpanded && (
                            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                                <CarouselPrevious className="static size-7 translate-y-0 border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95" />
                                <CarouselNext className="static size-7 translate-y-0 border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95" />
                            </div>
                        )}
                        <button
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-all duration-150 hover:bg-slate-200/80 hover:text-slate-900 active:scale-95"
                            title={
                                isExpanded
                                    ? "Minimise templates"
                                    : "Maximise templates"
                            }
                        >
                            <span className="text-xs">
                                {isExpanded ? "Minimise" : "Maximise"}
                            </span>
                            {isExpanded ? (
                                <ChevronUp className="size-3.5" />
                            ) : (
                                <ChevronDown className="size-3.5" />
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-2">
                                <CarouselContent className="-ml-3">
                                    {TEMPLATES.map((template) => (
                                        <CarouselItem
                                            key={template.id}
                                            className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                                        >
                                            <div
                                                className={cn(
                                                    "group flex flex-col gap-2 transition-all duration-200 active:scale-[0.97]",
                                                    isCreating &&
                                                        "pointer-events-none opacity-50",
                                                )}
                                            >
                                                <button
                                                    style={{
                                                        backgroundImage: `url(${template.imageUrl})`,
                                                    }}
                                                    className="flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 bg-cover bg-center bg-no-repeat transition-all duration-200 group-hover:border-blue-600 group-hover:bg-white group-hover:shadow-md"
                                                    disabled={isCreating}
                                                    onClick={() =>
                                                        create(
                                                            template.label,
                                                            template.initialContent,
                                                        )
                                                    }
                                                />
                                                <p className="truncate text-center text-xs font-semibold text-slate-700 transition-colors group-hover:text-blue-600">
                                                    {template.label}
                                                </p>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Carousel>
        </div>
    );
};
