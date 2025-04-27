import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import {
    AddTransactionSchema,
    AddTransactionWithoutTransformSchema,
} from "@/schemas/transaction-schema";
import {TransactionRequest, TransactionResponse, TransactionUpdateRequest} from "@/interfaces/transaction-interface";

type TransactionFormInput = z.infer<typeof AddTransactionWithoutTransformSchema>;
type TransactionFormData = z.infer<typeof AddTransactionSchema>;

interface TransactionFormProps {
    transactionData?: TransactionResponse;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    addTransaction?: (transaction: TransactionRequest) => Promise<void>;
    editTransaction?: (id: number, updatedTransaction: TransactionUpdateRequest) => Promise<void>;
}

export function useTransactionForm({
    transactionData,
    onSuccess,
    onError,
    addTransaction,
    editTransaction,
}: TransactionFormProps) {

    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!transactionData;

    const form = useForm<TransactionFormInput>({
        resolver: zodResolver(AddTransactionWithoutTransformSchema),
        defaultValues: {
            amount: transactionData?.amount.toString() || "0",
            merchant: transactionData?.merchant || "",
        },
    });

    const { reset } = form;

    const memoizedReset = useCallback((values: TransactionFormInput) => {
        reset(values);
    }, [reset]);

    useEffect(() => {
        if (transactionData) {
            memoizedReset({
                amount: transactionData.amount.toString(),
                merchant: transactionData.merchant,
            });
        }
    }, [transactionData, memoizedReset]);

    const processTransaction = async (formTransactionData: TransactionFormData) => {
        try {
            setIsLoading(true);

            if (isEditing && transactionData?.id && editTransaction) {
                await editTransaction(
                    transactionData.id,
                    {
                        amount: Number(formTransactionData.amount),
                        merchant: formTransactionData.merchant,
                    }
                );
            } else if (addTransaction) {
                await addTransaction({
                    amount: Number(formTransactionData.amount),
                    merchant: formTransactionData.merchant,
                });
                onSuccess?.();
            }

            if (transactionData) {
                onSuccess?.();
            }
        } catch (error) {
            const message = typeof error === "string" ? error : "Error inesperado";
            onError?.(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (data: TransactionFormInput) => {
        const serviceData: TransactionFormData = {
            amount: Number(data.amount),
            merchant: data.merchant,
        };

        await processTransaction(serviceData);
    };

    return {
        isLoading,
        isEditing,
        ...form,
        handleSend: form.handleSubmit(handleSend),
    };
}