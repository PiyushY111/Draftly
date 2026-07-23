"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { format, addDays } from "date-fns";
import { useEffect, useState } from "react";

export type SmartChipItem = {
    id: string;
    label: string;
    type: "user" | "document" | "date";
    avatar?: string;
};

export const useSmartChipData = (query: string) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { user } = useUser();
    const { memberships } = useOrganization({
        memberships: {
            pageSize: 5,
        },
    });

    const documentsData = useQuery(api.documents.getSuggestions, { search: query }) || [];

    const orgMembers = memberships?.data?.map((m) => {
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
    const filteredPeople = peopleList.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

    const today = new Date();
    const datesList = [
        { id: format(today, "yyyy-MM-dd"), label: `Today (${format(today, "MMM d, yyyy")})`, type: "date" as const },
        { id: format(addDays(today, 1), "yyyy-MM-dd"), label: `Tomorrow (${format(addDays(today, 1), "MMM d, yyyy")})`, type: "date" as const },
        { id: format(addDays(today, -1), "yyyy-MM-dd"), label: `Yesterday (${format(addDays(today, -1), "MMM d, yyyy")})`, type: "date" as const },
    ];
    const filteredDates = datesList.filter((d) => d.label.toLowerCase().includes(query.toLowerCase()));

    const mappedDocs = documentsData.map((doc) => ({
        id: doc._id,
        label: doc.title,
        type: "document" as const,
    }));

    const flatItems: SmartChipItem[] = [
        ...filteredPeople,
        ...mappedDocs,
        ...filteredDates,
    ];

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return {
        selectedIndex,
        setSelectedIndex,
        filteredPeople,
        mappedDocs,
        filteredDates,
        flatItems,
    };
};
