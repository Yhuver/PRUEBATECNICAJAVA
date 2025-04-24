import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTransactionWithoutTransformSchema, AddTransactionSchema } from "@/schemas/transaction-schema.ts";
import { addTransaction } from "@/services/transaction-service.ts";
import { z } from "zod";

type TransactionFormInput = z.infer<typeof AddTransactionWithoutTransformSchema>;
type TransactionFormData = z.infer<typeof AddTransactionSchema>;

interface TransactionFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function useAddTransactionForm({ onSuccess, onError }: TransactionFormProps = {}) {
    const form = useForm<TransactionFormInput>({
        resolver: zodResolver(AddTransactionWithoutTransformSchema),
        defaultValues: {
            amount: "0",
            merchant: "",
        },
    });

    const handleSend = async (data: TransactionFormInput) => {
        try {
            const serviceData: TransactionFormData = {
                amount: Number(data.amount),
                merchant: data.merchant
            };

            await addTransaction(serviceData);
            onSuccess?.();
        } catch (error) {
            const message = typeof error === "string" ? error : "Error inesperado";
            onError?.(message);
        }
    };

    return {
        ...form,
        handleSend: form.handleSubmit(handleSend),
    };
}