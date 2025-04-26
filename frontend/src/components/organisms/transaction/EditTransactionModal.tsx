import {TransactionResponse} from "@/interfaces/transaction-interface.ts";
import {Row} from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {toast} from "sonner";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";
import EditTransactionForm from "@/components/organisms/transaction/EditTransactionForm.tsx";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";


interface TransactionEditModalProps {
    row?: Row<TransactionResponse>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetchTable: () => void;
}

export default function EditTransactionModal({ open, onOpenChange, row, refetchTable } : TransactionEditModalProps) {

    const navigate = useNavigate();

    if (!row) return null;

    const onSuccess = () => {
        toast.success("Transacción editada correctamente.")
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
            title={"Editar transaction"}
        >
            <EditTransactionForm
                transactionId={row.original.id}
                onError={onError}
                onSuccess={onSuccess}
            />
        </ModalWrapper>
    )
}