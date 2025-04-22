import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface InputFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    isTextArea?: boolean;
    icon?: ReactNode;
    min?: number;
}

export default function InputField({ id, label, type = "text", placeholder, isTextArea = false, icon, min}: InputFieldProps) {
    return (
        <div className="relative grid w-full max-w-sm items-center gap-1.5 space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {isTextArea ? (
                <Textarea id={id} placeholder={placeholder} required />
            ) : (
                <div className="relative">
                    {icon && (
                        <span className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </span>
                    )}
                    <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        required
                        className={`pr-10 ${icon ? "pl-10" : ""}`}
                        min={min}
                    />
                </div>
            )}
        </div>
    );
}
