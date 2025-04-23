import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

type InputFieldProps = {
    id: string;
    label: string;
    isTextArea?: boolean;
    icon?: ReactNode;
    min?: string | number;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ id, label, type = "text", placeholder, isTextArea = false, icon, min, error, ...rest }, ref) => {
        return (
            <div className="relative grid w-full max-w-sm gap-1.5 space-y-2">
                <Label htmlFor={id}>{label}</Label>
                {isTextArea ? (
                    <>
                        <Textarea
                            id={id}
                            placeholder={placeholder}
                            className={error ? "border-red-500" : ""}
                            {...(rest as any)}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </>
                ) : (
                    <>
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
                                min={min}
                                className={`pr-10 ${icon ? "pl-10" : ""} ${
                                    error ? "border-red-500" : ""
                                }`}
                                {...rest}
                                ref={ref}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </>
                )}
            </div>
        );
    }
);

export default InputField;