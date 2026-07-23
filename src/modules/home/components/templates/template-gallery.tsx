"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn, handleError } from "@/lib/utils";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { TEMPLATES } from "../../constants";

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
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-xs transition-all">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <div
                    className={cn(
                        "flex items-center justify-between transition-all duration-300",
                        isExpanded && "mb-4",
                    )}
                >
                    {/* Header Label: START A NEW DOCUMENT */}
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#4f46e5]"></span>
                        <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                            Start a new document
                        </h3>
                    </div>

                    {/* Right Controls: Carousel arrows + Minimise button */}
                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-1"
                                >
                                    <CarouselPrevious className="static size-7 translate-y-0 cursor-pointer border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95" />
                                    <CarouselNext className="static size-7 translate-y-0 cursor-pointer border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                            title={
                                isExpanded
                                    ? "Minimise templates"
                                    : "Maximise templates"
                            }
                        >
                            <span>{isExpanded ? "Minimise" : "Maximise"}</span>
                            {isExpanded ? (
                                <ChevronUp className="size-3.5" />
                            ) : (
                                <ChevronDown className="size-3.5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Animated Minimise/Expand Container with Spring Stiffness */}
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 28,
                                mass: 0.8,
                            }}
                            className="overflow-hidden"
                        >
                            <div className="pt-1">
                                <CarouselContent className="-ml-3">
                                    {TEMPLATES.map((template) => (
                                        <CarouselItem
                                            key={template.id}
                                            className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                                        >
                                            <div
                                                className={cn(
                                                    "group flex flex-col items-center gap-2 transition-all duration-200 active:scale-[0.98]",
                                                    isCreating &&
                                                        "pointer-events-none opacity-50",
                                                )}
                                            >
                                                <button
                                                    disabled={isCreating}
                                                    onClick={() =>
                                                        create(
                                                            template.label,
                                                            template.initialContent,
                                                        )
                                                    }
                                                    className={cn(
                                                        "relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white shadow-2xs transition-all duration-200 group-hover:border-indigo-500 group-hover:shadow-md",
                                                        template.id ===
                                                            "project-proposal" &&
                                                            "border-indigo-500 ring-2 ring-indigo-500/20",
                                                    )}
                                                >
                                                    {template.id === "blank" ? (
                                                        /* Google-style Multi-color + Icon for Blank Document */
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="40"
                                                                height="40"
                                                                viewBox="0 0 40 40"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M17.5 4V17.5H4V22.5H17.5V36H22.5V22.5H36V17.5H22.5V4H17.5Z"
                                                                    fill="#4285F4"
                                                                />
                                                                <path
                                                                    d="M17.5 17.5H4V22.5H17.5V17.5Z"
                                                                    fill="#EA4335"
                                                                />
                                                                <path
                                                                    d="M22.5 22.5V36H17.5V22.5H22.5Z"
                                                                    fill="#34A853"
                                                                />
                                                                <path
                                                                    d="M22.5 17.5V4H17.5V17.5H22.5Z"
                                                                    fill="#FBBC05"
                                                                />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                                                            style={{
                                                                backgroundImage: `url(${template.imageUrl})`,
                                                            }}
                                                        />
                                                    )}
                                                </button>
                                                <p className="truncate text-center text-xs font-semibold text-slate-700 transition-colors group-hover:text-indigo-600">
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
