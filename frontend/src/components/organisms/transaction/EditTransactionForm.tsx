import { useTransactionContext } from "@/contexts/TransactionContext.tsx";
import { useTransactionForm } from "@/hooks/useTransactionForm.ts";
import InputField from "@/components/molecules/InputField.tsx";
import { TRANSACTION_ROUTE } from "@/constants/routes.ts";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router";
import { Banknote } from "lucide-react";

interface TransactionEditFormProps {
    onSuccess: () => void;
    onError: (errorMessage: string) => void;
    loadError?: string | null;
    onCancel?: () => void;
}

export default function EditTransactionForm({ onError, onSuccess, loadError, onCancel }: TransactionEditFormProps) {
    const navigate = useNavigate();
    const { selectedTransaction, editTransaction } = useTransactionContext();


    const {
        formState: { errors, isSubmitting },
        register,
        handleSend
    } = useTransactionForm({
        transactionData: selectedTransaction || undefined,
        onError,
        onSuccess,
        editTransaction
    });

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(TRANSACTION_ROUTE);
        }
    };

    if (!selectedTransaction) return null;

    return (
        <form onSubmit={handleSend} className="space-y-8">
            <div className="space-y-6 flex flex-col justify-center items-center">
                <InputField
                    icon={<Banknote className={"text-muted-foreground"} />}
                    id="amount"
                    label="Valor de la transacción"
                    type="number"
                    placeholder="0"
                    min={0}
                    {...register("amount")}
                    error={errors.amount?.message}
                    defaultValue={selectedTransaction?.amount || ""}
                />
                <InputField
                    id="merchant"
                    label="Motivo de la transacción"
                    placeholder="Motivo de la transacción..."
                    isTextArea
                    {...register("merchant")}
                    error={errors.merchant?.message}
                    defaultValue={selectedTransaction?.merchant || ""}
                />
            </div>

            {loadError && <div className="error-message">{loadError}</div>}

            <div className="flex space-x-6 space-y-4">
                <Button type="submit" className="flex-2" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className={"flex-1"}
                    onClick={handleCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
