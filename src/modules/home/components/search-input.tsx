"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="flex flex-1 items-center justify-center max-w-md mx-3">
            <div className="relative w-full">
                <Input
                    ref={inputRef}
                    className="h-8 w-full rounded-lg border border-slate-200/80 bg-slate-100/70 pl-8 pr-8 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xs focus-visible:outline-none focus-visible:ring-0 transition-all"
                    placeholder="Search documents..."
                    defaultValue={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-1.5 -translate-y-1/2 rounded-full size-7 hover:bg-transparent"
                >
                    <Search className="text-slate-400 size-4" />
                </Button>

                {search && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full size-7 hover:bg-slate-200/60"
                        onClick={onClear}
                    >
                        <X className="text-slate-500 size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};
