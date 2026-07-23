"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useSmartChipData } from "../../../hooks/use-smart-chip-data";
import { SmartChipItemButton } from "./smart-chip-item-button";

type Props = {
    query: string;
    command: (attrs: { id: string; label: string; type: string; avatar?: string }) => void;
};

export const SmartChipList = forwardRef((props: Props, ref) => {
    const { query, command } = props;

    const {
        selectedIndex,
        setSelectedIndex,
        filteredPeople,
        mappedDocs,
        filteredDates,
        flatItems,
    } = useSmartChipData(query);

    const selectItem = (index: number) => {
        const item = flatItems[index];
        if (item) {
            command({
                id: item.id,
                label: item.type === "date" ? item.label.split(" (")[0] : item.label,
                type: item.type,
                avatar: item.avatar,
            });
        }
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === "ArrowUp") {
                setSelectedIndex((selectedIndex - 1 + flatItems.length) % flatItems.length);
                return true;
            }
            if (event.key === "ArrowDown") {
                setSelectedIndex((selectedIndex + 1) % flatItems.length);
                return true;
            }
            if (event.key === "Enter") {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    if (flatItems.length === 0) {
        return (
            <div className="bg-white border rounded-lg shadow-lg py-2 px-3 text-sm text-slate-500 w-[240px]">
                No suggestions found
            </div>
        );
    }

    let globalIndex = 0;

    return (
        <div className="bg-white border rounded-lg shadow-lg p-1.5 w-[240px] max-h-[300px] overflow-y-auto space-y-2 z-[9999] select-none">
            {filteredPeople.length > 0 && (
                <div>
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        People
                    </div>
                    {filteredPeople.map((item) => {
                        const currentIndex = globalIndex++;
                        return (
                            <SmartChipItemButton
                                key={item.id}
                                item={item}
                                isSelected={selectedIndex === currentIndex}
                                onClick={() => selectItem(currentIndex)}
                            />
                        );
                    })}
                </div>
            )}

            {mappedDocs.length > 0 && (
                <div>
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        Documents
                    </div>
                    {mappedDocs.map((item) => {
                        const currentIndex = globalIndex++;
                        return (
                            <SmartChipItemButton
                                key={item.id}
                                item={item}
                                isSelected={selectedIndex === currentIndex}
                                onClick={() => selectItem(currentIndex)}
                            />
                        );
                    })}
                </div>
            )}

            {filteredDates.length > 0 && (
                <div>
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        Dates
                    </div>
                    {filteredDates.map((item) => {
                        const currentIndex = globalIndex++;
                        return (
                            <SmartChipItemButton
                                key={item.id}
                                item={item}
                                isSelected={selectedIndex === currentIndex}
                                onClick={() => selectItem(currentIndex)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
});

SmartChipList.displayName = "SmartChipList";
