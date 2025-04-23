import { Button } from "@/components/ui/button.tsx";
import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";
import LoginForm from "@/components/organisms/login-form.tsx";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange, setRegisterOpen }: LoginModalProps) {
    const navigate = useNavigate();

    const onSuccess = () => {
        toast.success("Sesión iniciada correctamente", {
            description: "Bienvenido de nuevo 👋",
        });
        onOpenChange(false)
        navigate(TRANSACTION_ROUTE)
    }

    const onError = () => {
        toast.error("No se pudo iniciar sesión", {
            description: "Verifica tus credenciales e intenta nuevamente.",
        });
    }

    return (
        <ModalSkeleton
            open={open}
            onOpenChange={onOpenChange}
            title="Iniciar sesión"
            description="Ingresa tus credenciales para acceder a tu cuenta"
        >
            <LoginForm
                onSuccess={onSuccess}
                onError={onError}
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