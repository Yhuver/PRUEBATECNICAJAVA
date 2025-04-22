import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ReactNode} from "react";

interface ModalSkeletonProps {
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
    description? :string;
    className? : string;
    children: ReactNode;
}

export default function ModalSkeleton({className, open, onOpenChange, title, description, children}: ModalSkeletonProps ){
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`sm:max-w-md ${className}`}>
                <DialogHeader className={"flex items-center justify-between space-y-4"}>
                    <DialogTitle className={"text-2xl"}>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )

}