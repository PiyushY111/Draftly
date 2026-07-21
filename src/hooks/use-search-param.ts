import { parseAsString, useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

export const useSearchParam = () => {
    const [search, setSearch] = useQueryState(
        "search",
        parseAsString.withDefault("").withOptions({
            clearOnDefault: true,
        }),
    );

    const debouncedSetSearch = useDebouncedCallback(setSearch, 500);

    return [search, debouncedSetSearch] as const;
};
