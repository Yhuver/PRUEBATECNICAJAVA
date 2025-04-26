import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";
import {useNavigate} from "react-router";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";
import RegisterForm from "@/components/organisms/auth/RegisterForm.tsx";


interface RegisterFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setLoginOpen: (open: boolean) => void;
}

export default function RegisterModal({open, onOpenChange, setLoginOpen }: RegisterFormProps) {

    const navigate = useNavigate();

    const onSuccess = () => {
        toast.success("Ahora puedes empezar a explorar.");
        onOpenChange(false);
        navigate(TRANSACTION_ROUTE);
    }

    const onError = () => {
        toast.error("Ha ocurrido un error", {
            description: "Por favor intenta más tarde.",
        })
    }

    return (
        <ModalWrapper
            open={open}
            onOpenChange={onOpenChange}
            title="Registrarse"
            description="Crea una nueva cuenta para comenzar"
        >
            <RegisterForm
                onSuccess={onSuccess}
                onError={onError}
            />

            <div className="text-center text-sm text-zinc-400 mt-4">
                ¿Ya tienes cuenta?{" "}
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
        </ModalWrapper>
    );
}