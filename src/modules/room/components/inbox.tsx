"use client";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Separator } from "@/components/ui";


import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import {
    ClientSideSuspense,
    useInboxNotifications,
} from "@liveblocks/react/suspense";


import { BellIcon, FileText } from "lucide-react";
import Link from "next/link";

export const InboxMenu = () => {
    const { inboxNotifications } = useInboxNotifications();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative" size="icon">
                        <BellIcon className="size-5" />
                        {inboxNotifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
                                {inboxNotifications.length}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-0 overflow-hidden w-auto">
                    {inboxNotifications.length > 0 ? (
                        <InboxNotificationList>
                            {inboxNotifications.map((notification) => {
                                if (notification.kind === "$documentShared") {
                                    const activity = notification.activities[0];
                                    const { docTitle, docUrl, ownerName } = (activity?.data || {}) as { docTitle?: string; docUrl?: string; ownerName?: string };
                                    return (
                                        <div
                                            key={notification.id}
                                            className="flex gap-3 p-3.5 hover:bg-slate-50 border-b border-slate-100 last:border-0 items-start select-none w-[320px]"
                                        >
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                                                <FileText className="size-4" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-sm">
                                                <p className="text-slate-600 leading-snug">
                                                    <span className="font-semibold text-slate-800">{ownerName}</span> shared a document with you:
                                                </p>
                                                <Link
                                                    href={docUrl || "#"}
                                                    className="font-semibold text-blue-600 hover:underline block mt-1 truncate"
                                                >
                                                    {docTitle || "Untitled document"}
                                                </Link>
                                            </div>
                                            {!notification.readAt && (
                                                <div className="size-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <InboxNotification
                                        key={notification.id}
                                        inboxNotification={notification}
                                    />
                                );
                            })}
                        </InboxNotificationList>
                    ) : (
                        <div className="text-muted-foreground w-[400px] p-2 text-center text-sm">
                            No notifications
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" className="!h-6" />
        </>
    );
};

export const Inbox = () => {
    return (
        <ClientSideSuspense
            fallback={
                <>
                    <Button
                        variant="ghost"
                        className="relative"
                        size="icon"
                        disabled
                    >
                        <BellIcon className="size-5" />
                    </Button>
                    <Separator orientation="vertical" className="!h-6" />
                </>
            }
        >
            <InboxMenu />
        </ClientSideSuspense>
    );
};
