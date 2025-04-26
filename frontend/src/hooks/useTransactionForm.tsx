import {addTransaction, getTransactionById, updateTransaction} from "@/services/transaction-service";
import { zodResolver } from "@hookform/resolvers/zod";
import {useCallback, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    AddTransactionSchema,
    AddTransactionWithoutTransformSchema,
} from "@/schemas/transaction-schema";
import { toast } from "sonner";

type TransactionFormInput = z.infer<typeof AddTransactionWithoutTransformSchema>;
type TransactionFormData = z.infer<typeof AddTransactionSchema>;

interface TransactionFormProps {
    transactionId?: number;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function useTransactionForm({ transactionId, onSuccess, onError }: TransactionFormProps = {}) {
    const [isLoading, setIsLoading] = useState(!!transactionId);
    const isEditMode = !!transactionId;

    const form = useForm<TransactionFormInput>({
        resolver: zodResolver(AddTransactionWithoutTransformSchema),
        defaultValues: {
            amount: "0",
            merchant: "",
        },
    });

    const { reset } = form;


    const memoizedReset = useCallback((values: TransactionFormInput) => {
        reset(values);
    }, [reset]);

    useEffect(() => {
        if (!transactionId) return;

        (async () => {
            try {
                setIsLoading(true);
                const response = await getTransactionById(transactionId);
                memoizedReset({ amount: response.amount.toString(), merchant: response.merchant });
            } catch {
                toast.error("Error al cargar los datos de la transacción.");
            } finally {
                setIsLoading(false);
            }
        })();

    }, [transactionId, memoizedReset]);

    const handleSend = async (data: TransactionFormInput) => {
        try {
            const serviceData: TransactionFormData = {
                amount: Number(data.amount),
                merchant: data.merchant
            };

            if (isEditMode && transactionId) {
                await updateTransaction(transactionId, serviceData);
            } else {
                await addTransaction(serviceData);
            }

            onSuccess?.();
        } catch (error) {
            const message = typeof error === "string" ? error : "Error inesperado";
            onError?.(message);
        }
    };

    return {
        isLoading,
        isEditMode,
        ...form,
        handleSend: form.handleSubmit(handleSend),
    };
}