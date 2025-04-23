import { Button } from "@/components/ui/button";
import InputField from "@/components/molecules/input-label";
import {useRegisterForm} from "@/hooks/useRegisterForm.ts";

interface RegisterFormProps {
    onSuccess: () => void;
    onError?: (msg: string) => void;
}

export default function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
    const {
        register,
        handleSend,
        formState: { errors, isSubmitting }
    } = useRegisterForm({ onSuccess, onError });

    return (
            <form onSubmit={handleSend} className="space-y-8">
                <div className="flex flex-col justify-center items-center space-y-4">
                    <InputField
                        id="fullName"
                        type="text"
                        label="Nombre completo"
                        placeholder="John Doe"
                        {...register("fullName")}
                        error={errors.fullName?.message}
                    />
                    <InputField
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        placeholder="tucorreo@ejemplo.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <InputField
                        id="password"
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        {...register("password")}
                        error={errors.password?.message}
                    />
                    <InputField
                        id="confirmPassword"
                        type="password"
                        label="Confirmar contraseña"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
            </form>
    );
}
