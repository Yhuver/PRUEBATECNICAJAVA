import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import { useAuthContext } from "@/contexts/AuthContext.tsx";

export type RegisterFormData = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function useRegisterForm({ onSuccess, onError }: RegisterFormProps = {}) {
    const { register } = useAuthContext()

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            fullName: "",
            password: "",
            confirmPassword: ""
        },
    });

    const handleSend = async (data: RegisterFormData) => {
        try {
            await register(data);
            onSuccess?.();
        } catch (error) {
            const message = typeof error === "string" ? error : "Error inesperado";
            onError?.(message);
        }
    };

    return {
        ...form,
        handleSend: form.handleSubmit(handleSend),
    };
}