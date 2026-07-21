import { TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { Building2, CircleUser, FileText, Star, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Doc } from "../../../../convex/_generated/dataModel";
import { DocumentMenu } from "./document-menu";
import { useDraggable } from "@dnd-kit/core";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
    document: Doc<"documents">;
};

export const DocumentRow = ({ document }: Props) => {
    const router = useRouter();
    const { userId, orgRole } = useAuth();
    
    const toggleStar = useMutation(api.documents.toggleStar);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: document._id,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: 999,
          }
        : undefined;

    const onClick = () => {
        router.push(`/documents/${document._id}`);
    };

    const handleStarClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleStar({ id: document._id });
            toast.success(document.isStarred ? "Document unstarred" : "Document starred");
        } catch (err) {
            toast.error("Failed to star document");
        }
    };

    const canRemove = userId === document.ownerId || orgRole === "org:admin";

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={cn(
                "cursor-pointer transition hover:bg-slate-50/80",
                isDragging && "opacity-50 shadow-md border-blue-200 bg-blue-50/20",
            )}
            onClick={onClick}
        >
            <TableCell className="w-[30px] pr-0" onClick={(e) => e.stopPropagation()}>
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
                    title="Drag to move"
                >
                    <GripVertical className="size-4 shrink-0" />
                </div>
            </TableCell>
            <TableCell className="w-[50px] text-center" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={handleStarClick}
                    className="p-1 hover:bg-slate-100 rounded-full transition"
                >
                    <Star
                        className={cn(
                            "size-4 text-slate-300 hover:text-yellow-400 hover:fill-yellow-400",
                            document.isStarred && "text-yellow-400 fill-yellow-400",
                        )}
                    />
                </button>
            </TableCell>
            <TableCell className="w-[50px] pr-0">
                <FileText className="text-blue-500 size-6" />
            </TableCell>
            <TableCell className="font-medium md:w-[45%]">
                {document.title}
            </TableCell>
            <TableCell className="text-muted-foreground [&_svg]:text-muted-foreground hidden items-center gap-2 md:flex [&_svg]:size-4">
                {document.organizationId ? <Building2 /> : <CircleUser />}
                {document.organizationId ? "Organization" : "Personal"}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(document._creationTime, "MMM d, yyyy")}
            </TableCell>
            <TableCell
                className="flex justify-end"
                onClick={(e) => e.stopPropagation()}
            >
                <DocumentMenu
                    id={document._id}
                    title={document.title}
                    canRemove={canRemove}
                />
            </TableCell>
        </TableRow>
    );
};
