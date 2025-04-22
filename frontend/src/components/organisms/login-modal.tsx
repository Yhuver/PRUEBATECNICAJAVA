import { useState } from "react";
import { Button } from "@/components/ui/button";
import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";
import InputField from "@/components/molecules/input-label.tsx";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange, setRegisterOpen }: LoginModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
        }, 1000);
    };

    return (
        <ModalSkeleton
            open={open}
            onOpenChange={onOpenChange}
            title="Iniciar Sesión"
            description="Ingresa tus credenciales para acceder a tu cuenta"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className={"flex flex-col justify-center items-center space-y-4"}>
                    <InputField id="email" label="Correo electrónico" type="email" placeholder="johndoe@email.com" />

                    <div className={"space-y-2 w-full flex flex-col justify-center items-center"}>
                        <InputField id="password" label="Password" type="password" placeholder="••••••••" />
                        <div className="text-sm w-full text-right flex justify-end">
                            <a href="#" className="text-zinc-400 hover:text-white">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                <div className="text-center text-sm text-zinc-400">
                    ¿No tienes una cuenta?{" "}
                    <Button
                        variant="link"
                        className="p-0 text-white hover:underline"
                        onClick={() => {
                            onOpenChange(false);
                            setTimeout(() => {
                                setRegisterOpen(true);
                            }, 100);
                        }}
                    >
                        Regístrate
                    </Button>
                </div>
            </form>
        </ModalSkeleton>
    );
}
