import AddTransactionForm from "@/components/organisms/transaction/AddTransactionForm.tsx";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";
import {useNavigate} from "react-router";
import {toast} from "sonner";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";

interface TransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetchTable: () => void;
}

export default function AddTransactionModal({ open, onOpenChange, refetchTable }: TransactionModalProps) {

    const navigate = useNavigate();

    const onSuccess = () => {
        toast.success("Transacción registrada correctamente.")
        onOpenChange(false)
        navigate(TRANSACTION_ROUTE);
        refetchTable();
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
            title="Añadir Transacción"
            description="Agrega los detalles de la nueva transacción"
        >
            <AddTransactionForm
                onSuccess={onSuccess}
                onError={onError}
            />
        </ModalWrapper>
    );
}
