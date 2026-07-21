"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSections } from "../../hooks/use-section";
import { AlignButton } from "./align-button";
import { FontFamilyButton } from "./font-family-button";
import { FontSizeButton } from "./font-size-button";
import { HeadingLevelButton } from "./heading-level-button";
import { HighlightColorButton } from "./highlight-color-button";
import { ImageButton } from "./image-button";
import { LineHeightButton } from "./line-height-button";
import { LinkButton } from "./link-button";
import { ListButton } from "./list-button";
import { TextColorButton } from "./text-color-button";

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
