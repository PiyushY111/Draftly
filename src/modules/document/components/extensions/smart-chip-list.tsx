"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { format, addDays } from "date-fns";
import { Calendar, FileText, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SmartChipItem = {
    id: string;
    label: string;
    type: "user" | "document" | "date";
    avatar?: string;
};

type Props = {
    query: string;
    command: (attrs: { id: string; label: string; type: string; avatar?: string }) => void;
};

export const SmartChipList = forwardRef((props: Props, ref) => {
    const { query, command } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { user } = useUser();
    const { memberships } = useOrganization({
        memberships: {
            pageSize: 5,
        },
    });

    // 1. Fetch documents from Convex
    const documentsData = useQuery(api.documents.getSuggestions, { search: query }) || [];

    // 2. Load people from Clerk
    const orgMembers =
        memberships?.data?.map((m) => {
            const firstName = m.publicUserData?.firstName;
            const lastName = m.publicUserData?.lastName;
            const name = firstName && lastName ? `${firstName} ${lastName}` : (firstName || m.publicUserData?.identifier || "Anonymous Member");
            return {
                id: m.publicUserData?.userId || "",
                label: name,
                avatar: m.publicUserData?.imageUrl,
                type: "user" as const,
            };
        }) || [];

    const currentUserItem = user
        ? [
              {
                  id: user.id,
                  label: `${user.fullName || user.username || "Me"} (You)`,
                  avatar: user.imageUrl,
                  type: "user" as const,
              },
          ]
        : [];

    const peopleList = orgMembers.length > 0 ? orgMembers : currentUserItem;

    // Filter people based on query
    const filteredPeople = peopleList.filter((p) =>
        p.label.toLowerCase().includes(query.toLowerCase()),
    );

    // 3. Date items
    const today = new Date();
    const datesList = [
        {
            id: format(today, "yyyy-MM-dd"),
            label: `Today (${format(today, "MMM d, yyyy")})`,
            type: "date" as const,
        },
        {
            id: format(addDays(today, 1), "yyyy-MM-dd"),
            label: `Tomorrow (${format(addDays(today, 1), "MMM d, yyyy")})`,
            type: "date" as const,
        },
        {
            id: format(addDays(today, -1), "yyyy-MM-dd"),
            label: `Yesterday (${format(addDays(today, -1), "MMM d, yyyy")})`,
            type: "date" as const,
        },
    ];

    const filteredDates = datesList.filter((d) =>
        d.label.toLowerCase().includes(query.toLowerCase()),
    );

    // Map documents to common structure
    const mappedDocs = documentsData.map((doc) => ({
        id: doc._id,
        label: doc.title,
        type: "document" as const,
    }));

    // Flatten all items for unified keyboard navigation
    const flatItems: SmartChipItem[] = [
        ...filteredPeople,
        ...mappedDocs,
        ...filteredDates,
    ];

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

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

    const upHandler = () => {
        setSelectedIndex((selectedIndex - 1 + flatItems.length) % flatItems.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % flatItems.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === "ArrowUp") {
                upHandler();
                return true;
            }
            if (event.key === "ArrowDown") {
                downHandler();
                return true;
            }
            if (event.key === "Enter") {
                enterHandler();
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

    // Keep track of index within the flat list to match items
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
                            <button
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition hover:bg-slate-50 cursor-pointer",
                                    selectedIndex === currentIndex && "bg-slate-100 text-slate-900 font-medium",
                                )}
                                onClick={() => selectItem(currentIndex)}
                            >
                                {item.avatar ? (
                                    <Avatar className="size-4 shrink-0">
                                        <AvatarImage src={item.avatar} alt={item.label} />
                                        <AvatarFallback className="text-[8px]">
                                            {item.label.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <User className="size-3.5 text-slate-400 shrink-0" />
                                )}
                                <span className="truncate">{item.label}</span>
                            </button>
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
                            <button
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition hover:bg-slate-50 cursor-pointer",
                                    selectedIndex === currentIndex && "bg-slate-100 text-slate-900 font-medium",
                                )}
                                onClick={() => selectItem(currentIndex)}
                            >
                                <FileText className="size-3.5 text-blue-500 shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </button>
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
                            <button
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition hover:bg-slate-50 cursor-pointer",
                                    selectedIndex === currentIndex && "bg-slate-100 text-slate-900 font-medium",
                                )}
                                onClick={() => selectItem(currentIndex)}
                            >
                                <Calendar className="size-3.5 text-amber-600 shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

SmartChipList.displayName = "SmartChipList";
