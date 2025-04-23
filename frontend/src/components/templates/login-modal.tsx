import { Button } from "@/components/ui/button.tsx";
import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";
import LoginForm from "@/components/organisms/login-form.tsx";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange, setRegisterOpen }: LoginModalProps) {
    return (
        <ModalSkeleton
            open={open}
            onOpenChange={onOpenChange}
            title="Iniciar sesión"
            description="Ingresa tus credenciales para acceder a tu cuenta"
        >
            <LoginForm
                onSuccess={() => onOpenChange(false)}
                onError={(msg : string) => {
                    console.error("Error de login:", msg);
                }}
            />

            <div className="text-center text-sm text-zinc-400 mt-4">
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
        </ModalSkeleton>
    );
}