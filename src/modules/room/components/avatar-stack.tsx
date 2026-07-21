"use client";

import { Separator } from "@/components/ui/separator";
import {
    ClientSideSuspense,
    useOthers,
    useSelf,
} from "@liveblocks/react/suspense";
import { Avatar } from "./avatar";

export const Avatars = () => {
    const users = useOthers();
    const currentUser = useSelf();

    if (users.length === 0) {
        return null;
    }

    return (
        <>
            <div className="flex items-center">
                {currentUser && (
                    <div className="relative ml-2">
                        <Avatar src={currentUser.info.avatar} name="You" />
                    </div>
                )}
                <div className="flex">
                    {users.map(({ connectionId, info }) => {
                        return (
                            <Avatar
                                key={connectionId}
                                src={info.avatar}
                                name={info.name}
                            />
                        );
                    })}
                </div>
            </div>
            <Separator orientation="vertical" className="!h-6" />
        </>
    );
};

export const AvatarStack = () => {
    return (
        <ClientSideSuspense fallback={null}>
            <Avatars />
        </ClientSideSuspense>
    );
};
