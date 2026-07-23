"use client";

import { useState } from "react";
import { useQueryState, parseAsString } from "nuqs";
import Image from "next/image";
import Link from "next/link";
import {
    Home,
    Star,
    Clock,
    Users,
    Trash2,
    Plus,
    Zap,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

type SidebarProps = {
    onCreateFolder?: () => void;
};

export const Sidebar = ({ onCreateFolder }: SidebarProps) => {
    const [tab, setTab] = useQueryState("tab", parseAsString);
    const [folderId, setFolderId] = useQueryState("folderId", parseAsString);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const activeTab = tab || "home";

    const handleTabChange = (targetTab: string | null) => {
        setTab(targetTab === "home" ? null : targetTab);
        setFolderId(null);
    };

    const navItems = [
        { id: "home", label: "Home", icon: Home },
        { id: "starred", label: "Starred", icon: Star },
        { id: "recent", label: "Recent", icon: Clock },
        { id: "shared", label: "Shared with me", icon: Users },
        { id: "trash", label: "Trash", icon: Trash2 },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 64 : 240 }}
            transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
            className={cn(
                "flex h-full shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white text-slate-700 select-none overflow-hidden",
                isCollapsed ? "p-2.5" : "p-4",
            )}
        >
            <div className="flex flex-col gap-6">
                {/* Logo & App Title */}
                <div
                    className={cn(
                        "flex items-center gap-2.5 py-1",
                        isCollapsed ? "justify-center px-0" : "px-2",
                    )}
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
                        onClick={() => handleTabChange("home")}
                    >
                        <Image
                            src="/logo.svg"
                            alt="Docs Logo"
                            width={28}
                            height={28}
                            className="shrink-0"
                        />
                        {!isCollapsed && (
                            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                                Docs
                            </span>
                        )}
                    </Link>
                </div>

                {/* Main Navigation Links */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            item.id === "home"
                                ? activeTab === "home" || activeTab === "drive"
                                : activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                title={isCollapsed ? item.label : undefined}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-150 cursor-pointer text-left whitespace-nowrap",
                                    isCollapsed && "justify-center px-0",
                                    isActive
                                        ? "bg-[#edf0ff] text-[#4f46e5] shadow-2xs"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "size-4 shrink-0",
                                        isActive
                                            ? "text-[#4f46e5]"
                                            : "text-slate-500",
                                    )}
                                />
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Workspaces Section */}
                <div className="flex flex-col gap-2 pt-2">
                    {!isCollapsed ? (
                        <div className="flex items-center justify-between px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase whitespace-nowrap">
                            <span>Workspaces</span>
                            {onCreateFolder && (
                                <button
                                    onClick={onCreateFolder}
                                    className="rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                                    title="Create new folder"
                                >
                                    <Plus className="size-3.5 stroke-[2.5]" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center text-slate-300 border-t border-slate-100 pt-2">
                            <span className="size-1 rounded-full bg-slate-300"></span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => handleTabChange("home")}
                            title={isCollapsed ? "Personal Workspace" : undefined}
                            className={cn(
                                "flex items-center gap-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer text-left whitespace-nowrap",
                                isCollapsed ? "justify-center p-2" : "px-3 py-2",
                            )}
                        >
                            <span className="flex size-5 items-center justify-center rounded-md bg-purple-100 text-[11px] font-bold text-purple-700 shrink-0">
                                P
                            </span>
                            {!isCollapsed && <span className="truncate">Personal</span>}
                        </button>
                        <button
                            onClick={() => handleTabChange("home")}
                            title={isCollapsed ? "Team Docs Workspace" : undefined}
                            className={cn(
                                "flex items-center gap-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer text-left whitespace-nowrap",
                                isCollapsed ? "justify-center p-2" : "px-3 py-2",
                            )}
                        >
                            <span className="flex size-5 items-center justify-center rounded-md bg-cyan-100 text-[11px] font-bold text-cyan-700 shrink-0">
                                T
                            </span>
                            {!isCollapsed && <span className="truncate">Team Docs</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Storage Box & Footer */}
            <div className="flex flex-col gap-4 pt-4">
                {/* Storage Indicator Card */}
                {!isCollapsed ? (
                    <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                        <span className="text-xs font-bold text-slate-800">
                            Storage
                        </span>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                            <div className="h-full w-[24%] rounded-full bg-indigo-600" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                            2.4 GB of 10 GB used
                        </span>
                        <button className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-indigo-50 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 active:scale-98">
                            <Zap className="size-3.5 fill-indigo-600 text-indigo-600" />
                            <span>Upgrade Plan</span>
                        </button>
                    </div>
                ) : (
                    <button
                        title="2.4 GB of 10 GB used - Upgrade Plan"
                        className="flex items-center justify-center rounded-xl bg-indigo-50 p-2.5 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                        <Zap className="size-4 fill-indigo-600 text-indigo-600" />
                    </button>
                )}

                {/* Footer User Avatar & Collapse Chevron */}
                <div
                    className={cn(
                        "flex items-center border-t border-slate-100 pt-3 px-1",
                        isCollapsed ? "flex-col gap-3 justify-center" : "justify-between",
                    )}
                >
                    {/* Clerk User Profile Image ONLY (no name or email as requested) */}
                    <div className="flex items-center justify-center cursor-pointer">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "size-8 rounded-full shadow-2xs hover:opacity-90 transition-opacity",
                                },
                            }}
                        />
                    </div>

                    {/* Sidebar Collapse Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer active:scale-95"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="size-4" />
                        ) : (
                            <ChevronLeft className="size-4" />
                        )}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};
