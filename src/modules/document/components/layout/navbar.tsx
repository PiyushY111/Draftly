"use client";
import { Button } from "@/components/ui";


import { AvatarStack } from "@/modules/room/components/avatar-stack";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { History, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DocumentInput } from "../editor/document-input";
import { ShareDialog } from "../dialogs/share-dialog";
import { NavbarMenu } from "../layout/navbar-menu";

type Props = {
    id: Id<"documents">;
    title: string;
    onToggleRevisions?: () => void;
};

export const Navbar = ({ id, title, onToggleRevisions }: Props) => {
    const [isShareOpen, setIsShareOpen] = useState(false);

    return (
        <>
            <ShareDialog
                documentId={id}
                open={isShareOpen}
                onOpenChange={setIsShareOpen}
            />
            <nav className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={36}
                            height={36}
                        />
                    </Link>
                    <div className="flex flex-col">
                        <DocumentInput id={id} title={title} />
                        <NavbarMenu
                            id={id}
                            title={title}
                            onToggleRevisions={onToggleRevisions}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsShareOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full gap-2 px-4 h-8 shadow-sm shrink-0 text-xs"
                    >
                        <UserPlus className="size-4" />
                        Share
                    </Button>
                    {onToggleRevisions && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleRevisions}
                            className="size-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-full transition shrink-0"
                            title="Version History"
                        >
                            <History className="size-4" />
                        </Button>
                    )}
                    <AvatarStack />
                    <OrganizationSwitcher
                        hideSlug
                        afterCreateOrganizationUrl="/"
                        afterLeaveOrganizationUrl="/"
                        afterSelectOrganizationUrl="/"
                        afterSelectPersonalUrl="/"
                    />
                    <UserButton />
                </div>
            </nav>
        </>
    );
};
