import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import { ReactNode } from "react";

interface ModalWrapperProps {
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
    description?: string;
    children: ReactNode;
}

export default function ModalWrapper(
    {  open, onOpenChange, title, description, children }: ModalWrapperProps
) {
    //
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
            <DialogContent className={`sm:max-w-md bg-black z-[1001]`}>
                <DialogHeader className="flex items-center justify-between space-y-4">
                    <DialogTitle className="text-2xl">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}