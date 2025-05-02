import AddTransactionForm from "@/components/organisms/transaction/AddTransactionForm.tsx";
import { TRANSACTION_ROUTE } from "@/constants/routes.ts";
import { useNavigate } from "react-router";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";
import { handleError, showToast } from "@/components/atoms/toastHandler.ts";

interface TransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddTransactionModal({ open, onOpenChange }: TransactionModalProps) {

    const navigate = useNavigate();

    const onSuccess = () => {
        showToast({ type: "success", message: "Transacción registrada correctamente." });
        onOpenChange(false);
        navigate(TRANSACTION_ROUTE);
    };

    const onError = (error: unknown) => {
        handleError(error);
    };

    const onCancel = () => {
        onOpenChange(false);
    };

    return (
        <ModalWrapper
            open={open}
            onOpenChange={onOpenChange}
            title="Añadir Transacción"
            description="Agrega los detalles de la nueva transacción"
        >
            <AddTransactionForm
                onSuccess={onSuccess}
                onError={onError}
                onCancel={onCancel}
            />
        </ModalWrapper>
    );
}
