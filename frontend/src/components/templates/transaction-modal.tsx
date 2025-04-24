import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";
import TransactionForm from "@/components/organisms/transaction-form.tsx";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";

interface TransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetchTable: () => void;
}

export default function TransactionModal({ open, onOpenChange, refetchTable }: TransactionModalProps) {

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
        <ModalSkeleton
            open={open}
            onOpenChange={onOpenChange}
            title="Añadir Transacción"
            description="Agrega los detalles de la nueva transacción"
        >
            <TransactionForm
                onSuccess={onSuccess}
                onError={onError}
            />

        </ModalSkeleton>
    );
}
