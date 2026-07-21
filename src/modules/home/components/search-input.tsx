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
        <div className="flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-[720px]">
                <Input
                    ref={inputRef}
                    className="h-12 w-full rounded-full border-none bg-[#f0f4fb] px-14 placeholder:text-neutral-800 focus-within:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)] focus:bg-white focus-visible:ring-0 md:text-base"
                    placeholder="Search"
                    defaultValue={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full"
                >
                    <Search className="text-muted-foreground size-5" />
                </Button>

                {search && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
                        onClick={onClear}
                    >
                        <X className="text-muted-foreground size-5" />
                    </Button>
                )}
            </div>
        </div>
    );
};
