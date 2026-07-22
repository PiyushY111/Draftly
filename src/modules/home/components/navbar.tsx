import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { Inbox } from "@/modules/room/components/inbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FilePlus, FolderPlus } from "lucide-react";

type NavbarProps = {
    onCreateDocument?: () => void;
    onCreateFolder?: () => void;
};

export const Navbar = ({ onCreateDocument, onCreateFolder }: NavbarProps) => {
    return (
        <nav className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-5 py-1.5 shadow-sm transition-all">
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

            <SearchInput />

            <div className="flex items-center gap-3 pl-3">
                {onCreateDocument && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                className="h-8 gap-1.5 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95 cursor-pointer"
                            >
                                <Plus className="size-3.5 stroke-[2.5]" />
                                <span>New</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                                onClick={onCreateDocument}
                                className="cursor-pointer font-medium text-slate-700"
                            >
                                <FilePlus className="mr-2 size-4 text-blue-600" />
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

                <Inbox />
                <OrganizationSwitcher hideSlug />
                <UserButton />
            </div>
        </nav>
    );
};
