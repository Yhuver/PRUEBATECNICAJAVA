import { useState } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/molecules/input-label";
import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";

interface RegisterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setLoginOpen: (open: boolean) => void;
}

export default function RegisterModal({ open, onOpenChange, setLoginOpen }: RegisterModalProps) {
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
            title="Registrarse"
            description="Crea una nueva cuenta para comenzar"
        >

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className={"space-y-6 flex flex-col items-center"}>
                    <InputField id="name" label="Nombre completo" type="text" placeholder="John Doe" />
                    <InputField id="email" label="Correo electrónico" type="email" placeholder="johndoe@email.com" />
                    <InputField id="password" label="Password" type="password" placeholder="••••••••" />
                    <InputField id="confirmPassword" label="Confirmar Password" type="password" placeholder="••••••••" />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrarse"}
                </Button>

                <div className="text-center text-sm text-zinc-400">
                    ¿Ya tienes una cuenta?{" "}
                    <Button
                        variant="link"
                        className="p-0 text-white hover:underline"
                        onClick={() => {
                            onOpenChange(false);
                            setTimeout(() => {
                                setLoginOpen(true);
                            }, 100);
                        }}
                    >
                        Inicia sesión
                    </Button>
                </div>
            </form>
        </ModalSkeleton>
    );
}
