import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { TRANSACTION_ROUTE } from "@/constants/routes.ts";
import { useNavigate } from "react-router";
import { useTransactionForm } from "@/hooks/useTransactionsForm.ts";
import InputField from "@/components/molecules/InputField.tsx";
import {TransactionUpdateRequest} from "@/interfaces/transaction-interface.ts";
import {useTransactionContext} from "@/contexts/TransactionContext.tsx";

interface TransactionEditFormProps {
    onSuccess: (transaction:  TransactionUpdateRequest) => void;
    onError: (errorMessage: string) => void;
    loadError?: string | null;
}


export default function EditTransactionForm({ onError, onSuccess, loadError }: TransactionEditFormProps) {
    const navigate = useNavigate();
    const { selectedTransaction} = useTransactionContext();

    const transactionData = selectedTransaction ?? undefined;

    const {
        formState: { errors, isSubmitting },
        register,
        handleSend
    } = useTransactionForm({ transactionData, onError, onSuccess});

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
                />
                <InputField
                    id="merchant"
                    label="Motivo de la transacción"
                    placeholder="Motivo de la transacción..."
                    isTextArea
                    {...register("merchant")}
                    error={errors.merchant?.message}
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
                    onClick={() => navigate(TRANSACTION_ROUTE)}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
