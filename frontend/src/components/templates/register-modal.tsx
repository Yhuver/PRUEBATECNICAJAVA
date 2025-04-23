import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";
import RegisterForm from "@/components/organisms/register-form.tsx";
import {Button} from "@/components/ui/button.tsx";

interface RegisterFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setLoginOpen: (open: boolean) => void;
}

export default function RegisterModal({open, onOpenChange, setLoginOpen }: RegisterFormProps) {
    return (
        <ModalSkeleton
            open={open}
            onOpenChange={onOpenChange}
            title="Registrarse"
            description="Crea una nueva cuenta para comenzar"
        >
            <RegisterForm
                onSuccess={() => onOpenChange(false)}
                onError={(msg: string) => {
                    console.error("Error de login:", msg);
                }}
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
        </ModalSkeleton>
    );
}