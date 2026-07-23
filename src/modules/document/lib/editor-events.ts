import { EditorView } from "@tiptap/pm/view";
import { Slice } from "@tiptap/pm/model";

export const handleDrop = (
    view: EditorView,
    event: DragEvent,
    slice: Slice,
    moved: boolean
): boolean => {
    if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const files = Array.from(event.dataTransfer.files);
        const imageFiles = files.filter(file => /image\/(png|jpe?g|gif|webp)/.test(file.type));
        if (imageFiles.length > 0) {
            event.preventDefault();
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const pos = coordinates ? coordinates.pos : view.state.doc.content.size;
            
            imageFiles.forEach((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (view.isDestroyed) return;
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src: reader.result });
                    const transaction = view.state.tr.insert(pos, node);
                    view.dispatch(transaction);
                };
            });
            return true;
        }
    }
    return false;
};

export const handlePaste = (view: EditorView, event: ClipboardEvent): boolean => {
    if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
        const files = Array.from(event.clipboardData.files);
        const imageFiles = files.filter(file => /image\/(png|jpe?g|gif|webp)/.test(file.type));
        if (imageFiles.length > 0) {
            event.preventDefault();
            imageFiles.forEach((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (view.isDestroyed) return;
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src: reader.result });
                    const transaction = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(transaction);
                };
            });
            return true;
        }
    }
    return false;
};
