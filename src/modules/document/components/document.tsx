"use client";

import { Room } from "@/modules/room/components/room";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";
import { TabsPanel } from "./tabs-panel";
import { RevisionsSidebar } from "./revisions-sidebar";
import { useEditorStore } from "@/providers/editor-store-provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
    preloadedDocument: Preloaded<typeof api.documents.get>;
};

export const Document = ({ preloadedDocument }: Props) => {
    const document = usePreloadedQuery(preloadedDocument);
    const { editor } = useEditorStore((state) => state);
    const [isTabsOpen, setIsTabsOpen] = useState(true);

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyContent, setHistoryContent] = useState<string | null>(null);
    const [activeRevisionId, setActiveRevisionId] = useState<Id<"revisions"> | null>(null);

    const documentTabs = [
        { id: "main", title: "Main Document", roomId: document?._id || "" },
        ...(document?.tabs || []),
    ];

    const [activeTabId, setActiveTabId] = useState(
        documentTabs[0]?.roomId || document?._id || ""
    );

    if (!document) {
        return null;
    }

    const activeRoomId = activeTabId || document._id;
    const isTimeTraveling = historyContent !== null;
    const onEnterTimeTravel = (content: string, revisionId: Id<"revisions">) => {
        setHistoryContent(content);
        setActiveRevisionId(revisionId);
    };

    const onExitTimeTravel = () => {
        setHistoryContent(null);
        setActiveRevisionId(null);
    };

    return (
        <Room key={activeRoomId} documentId={document._id} roomId={activeRoomId}>
            <div className="min-h-screen bg-[#fafbfd] flex flex-col h-screen overflow-hidden">
                <div className="fixed inset-x-0 top-0 z-50 flex flex-col gap-y-2 bg-[#fafbfd] px-4 pt-2 print:hidden border-b border-slate-200/80">
                    <Navbar
                        id={document._id}
                        title={document.title}
                        onToggleRevisions={() => setIsHistoryOpen(!isHistoryOpen)}
                    />
                    <Toolbar />
                </div>
                
                <div className="flex flex-1 pt-[120px] min-h-0 overflow-hidden flex-col">
                    {isTimeTraveling && (
                        <div className="bg-blue-600 text-white px-6 py-2 flex items-center justify-between text-sm shrink-0 shadow-sm print:hidden">
                            <span className="font-medium">Viewing a past version of this document</span>
                            <Button
                                onClick={onExitTimeTravel}
                                size="sm"
                                className="bg-white text-blue-600 hover:bg-slate-100 hover:text-blue-700 font-bold h-7 px-3 text-xs"
                            >
                                Close Version Preview
                            </Button>
                        </div>
                    )}
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
                                documentId={document._id}
                                initialContent={isTimeTraveling ? historyContent! : (activeRoomId === document._id ? document.initialContent : undefined)}
                                isTimeTraveling={isTimeTraveling}
                                editable={!isTimeTraveling}
                            />
                        </div>
                        <RevisionsSidebar
                            documentId={document._id}
                            editor={editor}
                            onEnterTimeTravel={onEnterTimeTravel}
                            onExitTimeTravel={onExitTimeTravel}
                            isTimeTraveling={isTimeTraveling}
                            activeRevisionId={activeRevisionId}
                            isOpen={isHistoryOpen}
                            onClose={() => setIsHistoryOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </Room>
    );
};
