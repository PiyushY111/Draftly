"use client";

import { Room } from "@/modules/room/components/room";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";
import { TabsPanel } from "./tabs-panel";
import { useState } from "react";

type Props = {
    preloadedDocument: Preloaded<typeof api.documents.get>;
};

export const Document = ({ preloadedDocument }: Props) => {
    const document = usePreloadedQuery(preloadedDocument);
    const [isTabsOpen, setIsTabsOpen] = useState(true);

    const documentTabs = document?.tabs || [
        { id: "main", title: "Main Document", roomId: document?._id || "" },
    ];

    const [activeTabId, setActiveTabId] = useState(
        documentTabs[0]?.roomId || document?._id || ""
    );

    if (!document) {
        return null;
    }

    const activeRoomId = activeTabId || document._id;

    return (
        <Room key={activeRoomId} documentId={document._id} roomId={activeRoomId}>
            <div className="min-h-screen bg-[#fafbfd] flex flex-col h-screen overflow-hidden">
                <div className="fixed inset-x-0 top-0 z-50 flex flex-col gap-y-2 bg-[#fafbfd] px-4 pt-2 print:hidden border-b border-slate-200/80">
                    <Navbar
                        id={document._id}
                        title={document.title}
                    />
                    <Toolbar />
                </div>
                
                <div className="flex flex-1 pt-[120px] min-h-0 overflow-hidden flex-col">
                    <div className="flex flex-1 min-h-0 overflow-hidden">
                        <TabsPanel
                            documentId={document._id}
                            tabs={documentTabs}
                            activeTabId={activeRoomId}
                            onSelectTab={setActiveTabId}
                            isOpen={isTabsOpen}
                            onToggle={() => setIsTabsOpen(!isTabsOpen)}
                        />
                        <div className="flex-1 overflow-y-auto print:overflow-visible">
                            <Editor
                                initialContent={activeRoomId === document._id ? document.initialContent : undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Room>
    );
};
