import { Button } from "@/components/ui/button";
import InputField from "@/components/molecules/input-label";
import { useLoginForm } from "@/hooks/useLoginForm";

interface LoginFormProps {
    onSuccess: () => void;
    onError?: (msg: string) => void;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
    const {
        register,
        handleSend,
        formState: { errors, isSubmitting },
    } = useLoginForm({ onSuccess, onError });

    return (
        <form onSubmit={handleSend} className="space-y-8">
            <div className="flex flex-col justify-center items-center space-y-4">
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

                <div className="text-sm w-full text-right">
                    <a href="#" className="text-zinc-400 hover:text-white">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
        </form>
    );
}