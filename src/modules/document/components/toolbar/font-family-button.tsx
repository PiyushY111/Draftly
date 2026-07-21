import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/providers/editor-store-provider";
import { ChevronDown } from "lucide-react";

type FontFamily = {
    label: string;
    value: string;
};

export const FONT_FAMILIES: FontFamily[] = [
    // Sans-Serif
    { label: "Arial", value: "Arial" },
    { label: "Inter", value: "Inter" },
    { label: "Roboto", value: "Roboto" },
    { label: "Open Sans", value: "Open Sans" },
    { label: "Lato", value: "Lato" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Poppins", value: "Poppins" },
    { label: "Raleway", value: "Raleway" },
    { label: "Nunito", value: "Nunito" },
    { label: "Work Sans", value: "Work Sans" },
    { label: "DM Sans", value: "DM Sans" },
    { label: "Fira Sans", value: "Fira Sans" },
    { label: "Quicksand", value: "Quicksand" },
    { label: "Josefin Sans", value: "Josefin Sans" },
    { label: "Cabin", value: "Cabin" },
    { label: "Arimo", value: "Arimo" },
    { label: "Rubik", value: "Rubik" },
    { label: "Ubuntu", value: "Ubuntu" },
    { label: "Karla", value: "Karla" },
    { label: "Kanit", value: "Kanit" },
    { label: "Prompt", value: "Prompt" },
    { label: "Play", value: "Play" },
    { label: "Signika", value: "Signika" },
    { label: "Exo 2", value: "Exo 2" },
    { label: "Verdana", value: "Verdana" },
    { label: "Tahoma", value: "Tahoma" },
    { label: "Trebuchet MS", value: "Trebuchet MS" },

    // Serif
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Garamond", value: "Garamond" },
    { label: "Lora", value: "Lora" },
    { label: "Merriweather", value: "Merriweather" },
    { label: "Playfair Display", value: "Playfair Display" },
    { label: "PT Serif", value: "PT Serif" },
    { label: "EB Garamond", value: "EB Garamond" },
    { label: "Bitter", value: "Bitter" },
    { label: "Cardo", value: "Cardo" },
    { label: "Cinzel", value: "Cinzel" },

    // Monospace
    { label: "Courier New", value: "Courier New" },
    { label: "Fira Code", value: "Fira Code" },
    { label: "Source Code Pro", value: "Source Code Pro" },
    { label: "JetBrains Mono", value: "JetBrains Mono" },
    { label: "Inconsolata", value: "Inconsolata" },
    { label: "Roboto Mono", value: "Roboto Mono" },

    // Display & Handwriting
    { label: "Oswald", value: "Oswald" },
    { label: "Bebas Neue", value: "Bebas Neue" },
    { label: "Teko", value: "Teko" },
    { label: "Pacifico", value: "Pacifico" },
    { label: "Caveat", value: "Caveat" },
    { label: "Dancing Script", value: "Dancing Script" },
    { label: "Lobster", value: "Lobster" },
    { label: "Great Vibes", value: "Great Vibes" },
    { label: "Sacramento", value: "Sacramento" },
    { label: "Yellowtail", value: "Yellowtail" },
    { label: "Lilita One", value: "Lilita One" },
    { label: "Righteous", value: "Righteous" },
    { label: "Abril Fatface", value: "Abril Fatface" },
];

export const FontFamilyButton = () => {
    const { editor } = useEditorStore((state) => state);

    const currentFont = editor?.getAttributes("textStyle").fontFamily || "Arial";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="xs"
                    variant="toolbar"
                    className="w-[140px] justify-between"
                >
                    <span className="truncate font-normal text-left flex-1" style={{ fontFamily: currentFont }}>
                        {currentFont}
                    </span>
                    <ChevronDown className="ml-1 size-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-1 max-h-[350px] overflow-y-auto w-[220px]" align="start">
                {FONT_FAMILIES.map(({ label, value }) => (
                    <DropdownMenuItem
                        key={value}
                        className={cn(
                            currentFont === value && "bg-accent text-accent-foreground",
                        )}
                        style={{ fontFamily: value }}
                        onClick={() =>
                            editor?.chain().focus().setFontFamily(value).run()
                        }
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
