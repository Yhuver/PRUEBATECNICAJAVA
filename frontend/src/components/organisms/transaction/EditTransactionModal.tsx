import { useTransactionContext } from "@/contexts/TransactionContext.tsx";
import { TransactionUpdateRequest } from "@/interfaces/transaction-interface.ts";
import { useNavigate } from "react-router";
import EditTransactionForm from "@/components/organisms/transaction/EditTransactionForm.tsx";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";
import { showToast, handleError } from "@/components/atoms/toastHandler.ts";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";

interface TransactionEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditTransactionModal({ open, onOpenChange }: TransactionEditModalProps) {
    const navigate = useNavigate();
    const { editTransaction, selectedTransaction,  } = useTransactionContext();

    if (!selectedTransaction) return null;

    const onSuccess = (updatedTransaction: TransactionUpdateRequest) => {
        showToast({ type: "success", message: "Transacción editada correctamente" });
        editTransaction(selectedTransaction.id, updatedTransaction);
        onOpenChange(false);
        navigate(TRANSACTION_ROUTE);
    };

    const onError = (error: unknown) => {
        handleError(error);
    };

    return (
        <ModalWrapper open={open} onOpenChange={onOpenChange} title={"Editar transacción"}>
            <EditTransactionForm
                onError={onError}
                onSuccess={onSuccess}
            />
        </ModalWrapper>
    );
}
