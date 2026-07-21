import { useMutation, useStorage } from "@liveblocks/react";
import { EDGE_OFFSET } from "../constants";

type Side = keyof Liveblocks["Storage"];

export const useRuler = (side: Side) => {
    const padding = useStorage((root) => root[side]) ?? EDGE_OFFSET;
    const setPadding = useMutation(({ storage }, position: number) => {
        storage.set(side, position);
    }, []);

    return [padding, setPadding] as const;
};
