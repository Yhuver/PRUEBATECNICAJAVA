import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import {register} from "@/services/auth-service";

export type RegisterFormData = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function useRegisterForm({ onSuccess, onError }: RegisterFormProps = {}) {
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
            onSuccess?.(); // TODO Abrir una notificación de registro correcto
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