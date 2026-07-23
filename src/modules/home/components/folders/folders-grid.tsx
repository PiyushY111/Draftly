"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { FolderCard } from "./folder-card";

type Props = {
    parentFolderId?: Id<"folders">;
    onFolderClick: (id: Id<"folders">) => void;
};

export const FoldersGrid = ({ parentFolderId, onFolderClick }: Props) => {
    const folders = useQuery(api.folders.list, { parentFolderId });

    if (!folders || folders.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Folders
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                    <FolderCard
                        key={folder._id}
                        folder={folder}
                        onClick={() => onFolderClick(folder._id)}
                    />
                ))}
            </div>
        </div>
    );
};
