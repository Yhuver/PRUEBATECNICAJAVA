import EditTransactionForm from "@/components/organisms/transaction/EditTransactionForm.tsx";
import { showToast, handleError } from "@/components/atoms/toastHandler.ts";
import { useTransactionContext } from "@/contexts/TransactionContext.tsx";
import ModalWrapper from "@/components/templates/ModalWrapper.tsx";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";
import { useNavigate } from "react-router";

interface TransactionEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditTransactionModal({ open, onOpenChange }: TransactionEditModalProps) {
    const navigate = useNavigate();
    const { selectedTransaction,  } = useTransactionContext();

    if (!selectedTransaction) return null;

    const onSuccess = () => {
        showToast({ type: "success", message: "Transacción editada correctamente" });
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
