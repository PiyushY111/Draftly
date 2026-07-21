import { Icons } from "@/components/icons";
import { handleError } from "@/lib/utils";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
    id: string;
    title: string;
};

export const DocumentInput = ({ id, title }: Props) => {
    const [value, setValue] = useState(title);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setValue(title);
    }, [title]);

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.documents.update),
    });

    const onSave = () => {
        const newTitle = value.trim();

        if (newTitle !== title) {
            mutate(
                {
                    id: id as Id<"documents">,
                    title: newTitle || "Untitled Document",
                },
                {
                    onError(error) {
                        handleError(error);
                    },

                    onSettled() {
                        setIsEditing(false);
                    },
                },
            );
        }
    };

    return (
        <div className="flex items-center gap-1">
            {isEditing ? (
                <form
                    className="relative w-fit max-w-[50ch]"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                >
                    <span className="invisible px-1.5 text-lg whitespace-pre">
                        {value || ""}
                    </span>
                    <input
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onSave}
                        className="absolute inset-0 truncate bg-transparent px-1.5 text-lg text-black focus:outline-blue-400"
                        disabled={isPending}
                    />
                </form>
            ) : (
                <span
                    className="cursor-text truncate rounded-xs border-1 border-transparent px-1.5 text-lg hover:border-blue-400"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    {title}
                </span>
            )}
            {isPending ? (
                <Loader className="text-muted-foreground size-5 animate-spin" />
            ) : (
                <Icons.cloudCheck className="text-muted-foreground size-5" />
            )}
        </div>
    );
};
