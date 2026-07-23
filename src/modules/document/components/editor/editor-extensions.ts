import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize } from "../extensions/formatting/font-size";
import { LineHeight } from "../extensions/formatting/line-height";
import { SmartChip } from "../extensions/smart-chip/smart-chip";

export const getEditorExtensions = (isTimeTraveling: boolean) => [
    StarterKit.configure({
        history: isTimeTraveling ? false : undefined,
    }),
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    ImageResize,
    Underline,
    TextStyle,
    FontFamily,
    Color,
    Highlight.configure({ multicolor: true }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
    }),
    TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
    }),
    FontSize,
    LineHeight.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
    }),
    SmartChip,
];
