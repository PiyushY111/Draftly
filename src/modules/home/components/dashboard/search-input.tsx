"use client";
import { Button, Input } from "@/components/ui";


import { useSearchParam } from "@/hooks/use-search-param";
import { Search, X } from "lucide-react";
import { useRef } from "react";

export const SearchInput = () => {
    const [search, setSearch] = useSearchParam();
    const inputRef = useRef<HTMLInputElement>(null);

    const onClear = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
        }
        setSearch("");
    };

    return (
        <div className="relative flex flex-1 items-center max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <input
                ref={inputRef}
                className="h-10 w-full rounded-full border border-slate-200/80 bg-slate-100/60 pl-10 pr-12 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:shadow-xs focus:outline-none transition-all"
                placeholder="Search documents..."
                defaultValue={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 cursor-pointer"
                    onClick={onClear}
                >
                    <X className="size-3.5" />
                </button>
            ) : (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-md border border-slate-200/80 bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs select-none">
                    <span>⌘</span>
                    <span>K</span>
                </div>
            )}
        </div>
    );
};
