"use client";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";


import { Star, Table, Filter, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
    viewMode: "cards" | "table";
    setViewMode: (mode: "cards" | "table") => void;
    activeTab: string;
    setTab: (tab: string | null) => void;
    setFolderId: (id: string | null) => void;
};

export const DashboardToolbar = ({
    viewMode,
    setViewMode,
    activeTab,
    setTab,
    setFolderId,
}: Props) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1" />

            <div className="flex items-center gap-2.5">
                <div className="relative flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
                    <button
                        onClick={() => setViewMode("cards")}
                        className={cn(
                            "relative z-10 flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors duration-200 select-none active:scale-[0.97]",
                            viewMode === "cards" ? "font-bold text-slate-900" : "text-slate-600 hover:text-slate-900",
                        )}
                    >
                        {viewMode === "cards" && (
                            <motion.div
                                layoutId="viewModePill"
                                className="absolute inset-0 z-[-1] rounded-lg bg-white shadow-xs"
                                transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                            />
                        )}
                        <LayoutGrid className="size-3.5" />
                        <span>Cards</span>
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={cn(
                            "relative z-10 flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors duration-200 select-none active:scale-[0.97]",
                            viewMode === "table" ? "font-bold text-slate-900" : "text-slate-600 hover:text-slate-900",
                        )}
                    >
                        {viewMode === "table" && (
                            <motion.div
                                layoutId="viewModePill"
                                className="absolute inset-0 z-[-1] rounded-lg bg-white shadow-xs"
                                transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                            />
                        )}
                        <Table className="size-3.5" />
                        <span>Table</span>
                    </button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (activeTab === "starred") {
                            setTab(null);
                        } else {
                            setTab("starred");
                            setFolderId(null);
                        }
                    }}
                    className={cn(
                        "h-8 cursor-pointer gap-1.5 rounded-xl border border-dashed text-xs font-semibold transition-all active:scale-[0.98]",
                        activeTab === "starred"
                            ? "border-amber-300 bg-amber-50 text-amber-800 shadow-xs hover:bg-amber-100"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                    )}
                >
                    <Star className={cn("size-3.5", activeTab === "starred" ? "fill-amber-500 text-amber-500" : "text-slate-500")} />
                    <span>Starred</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 cursor-pointer gap-1.5 rounded-xl border-dashed border-slate-300 bg-white text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
                        >
                            <Filter className="size-3.5 text-slate-500" />
                            <span>Filter</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => { setTab(null); setFolderId(null); }} className="cursor-pointer font-medium text-slate-700">
                            All Files
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setTab("starred"); setFolderId(null); }} className="cursor-pointer font-medium text-slate-700">
                            <Star className="mr-2 size-3.5 fill-amber-500 text-amber-500" />
                            Starred Only
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
