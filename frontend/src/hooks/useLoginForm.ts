import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import { login } from "@/services/auth-service";

export type LoginFormData = z.infer<typeof LoginSchema>;

interface UseLoginFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function useLoginForm({ onSuccess, onError }: UseLoginFormProps = {}) {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const handleSend = async (data: LoginFormData) => {
        try {
            await login(data);
            onSuccess?.();
        } catch (error: any) {
            const message = typeof error === "string" ? error : "Error inesperado";
            onError?.(message);
        }
    };

    return {
        ...form,
        handleSend: form.handleSubmit(handleSend),
    };
}