"use client";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { Inbox } from "@/modules/room/components/inbox";
import { Plus, FilePlus, FolderPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
    onCreateDocument?: () => void;
    onCreateFolder?: () => void;
};

export const Navbar = ({ onCreateDocument, onCreateFolder }: NavbarProps) => {
    return (
        <header className="flex h-14 w-full items-center justify-between gap-4 bg-transparent px-2 py-1">
            {/* Logo on the Left */}
            <div className="flex shrink-0 items-center gap-3 pr-3">
                <Link
                    href="/"
                    className="group flex cursor-pointer items-center gap-2"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={28}
                        height={28}
                        className="transition-transform group-hover:scale-105"
                    />
                    <span className="text-base font-bold tracking-tight text-slate-900">
                        Docs
                    </span>
                </Link>
            </div>

            {/* Search Input in Center */}
            <div className="flex flex-1 items-center max-w-xl">
                <SearchInput />
            </div>

            {/* Right Action Controls: + New, Bell Notification, Clerk Auth */}
            <div className="flex items-center gap-3">
                {onCreateDocument && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                className="h-9 gap-1.5 rounded-full bg-[#4f46e5] px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer"
                            >
                                <Plus className="size-4 stroke-[2.5]" />
                                <span>New</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                            <DropdownMenuItem
                                onClick={onCreateDocument}
                                className="cursor-pointer font-medium text-slate-700"
                            >
                                <FilePlus className="mr-2 size-4 text-indigo-600" />
                                New Document
                            </DropdownMenuItem>
                            {onCreateFolder && (
                                <DropdownMenuItem
                                    onClick={onCreateFolder}
                                    className="cursor-pointer font-medium text-slate-700"
                                >
                                    <FolderPlus className="mr-2 size-4 text-amber-500" />
                                    New Folder
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Notification Bell / Inbox */}
                <div className="flex items-center justify-center">
                    <Inbox />
                </div>

                {/* Clerk Organization Switcher & User Button Profile */}
                <div className="flex items-center gap-2 border-l border-slate-200/80 pl-3">
                    <OrganizationSwitcher
                        hideSlug
                        appearance={{
                            elements: {
                                organizationSwitcherTrigger:
                                    "flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/60 px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                            },
                        }}
                    />
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "size-8 rounded-full",
                            },
                        }}
                    />
                </div>
            </div>
        </header>
    );
};
