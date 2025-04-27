import {Button} from "@/components/ui/button.tsx";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";
import {useNavigate} from "react-router";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";
import RegisterForm from "@/components/organisms/auth/RegisterForm.tsx";
import {handleError, showToast} from "@/components/atoms/toastHandler";


interface RegisterFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setLoginOpen: (open: boolean) => void;
}

export default function RegisterModal({open, onOpenChange, setLoginOpen }: RegisterFormProps) {

    const navigate = useNavigate();


    const onSuccess = () => {
        showToast({type: "success", message: "Ahora puedes empezar a explorar."});
        onOpenChange(false);
        navigate(TRANSACTION_ROUTE);
    }

    const onError = (error: unknown) => {
        handleError(error);
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