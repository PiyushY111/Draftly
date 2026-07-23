"use client";
import { Button, Separator } from "@/components/ui";


import { cn } from "@/lib/utils";
import { useSections } from "../../hooks/use-section";
import { AlignButton } from "./layout/align-button";
import { FontFamilyButton } from "./text/font-family-button";
import { FontSizeButton } from "./text/font-size-button";
import { HeadingLevelButton } from "./text/heading-level-button";
import { HighlightColorButton } from "./text/highlight-color-button";
import { ImageButton } from "./insert/image-button";
import { LineHeightButton } from "./layout/line-height-button";
import { LinkButton } from "./insert/link-button";
import { ListButton } from "./layout/list-button";
import { TextColorButton } from "./text/text-color-button";

export const Toolbar = () => {
    const sections = useSections();

    return (
        <div className="flex min-h-10 items-center gap-x-0.5 gap-y-1 overflow-x-auto rounded-sm bg-[#f1f4f9] px-2.5 py-0.5">
            {sections[0].map((item) => (
                <Button
                    key={item.label}
                    onClick={item.onClick}
                    variant="toolbar"
                    size="xs"
                >
                    <item.icon />
                </Button>
            ))}
            <Separator orientation="vertical" className="h-6! bg-neutral-300" />

            <FontFamilyButton />
            <Separator orientation="vertical" className="h-6! bg-neutral-300" />

            <HeadingLevelButton />
            <Separator orientation="vertical" className="h-6! bg-neutral-300" />

            <FontSizeButton />
            <Separator orientation="vertical" className="h-6! bg-neutral-300" />
            {sections[1].map((item) => (
                <Button
                    key={item.label}
                    onClick={item.onClick}
                    variant="toolbar"
                    size="xs"
                >
                    <item.icon />
                </Button>
            ))}
            <Separator orientation="vertical" className="h-6! bg-neutral-300" />

            <TextColorButton />
            <HighlightColorButton />

            <Separator orientation="vertical" className="h-6! bg-neutral-300" />
            <LinkButton />
            <ImageButton />
            <AlignButton />
            <LineHeightButton />
            <ListButton />
            {sections[2].map((item) => (
                <Button
                    key={item.label}
                    onClick={item.onClick}
                    variant="toolbar"
                    size="xs"
                    className={cn(item.isActive && "bg-neutral-200/80")}
                >
                    <item.icon />
                </Button>
            ))}
        </div>
    );
};
