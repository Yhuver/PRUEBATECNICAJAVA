import { addTransaction, updateTransaction } from "@/services/transaction-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    AddTransactionSchema,
    AddTransactionWithoutTransformSchema,
} from "@/schemas/transaction-schema";
import { TransactionUpdateRequest, TransactionResponse } from "@/interfaces/transaction-interface.ts";
import {useEffect} from "react";

type TransactionFormInput = z.infer<typeof AddTransactionWithoutTransformSchema>;
type TransactionFormData = z.infer<typeof AddTransactionSchema>;

interface TransactionFormProps {
    transactionData?: TransactionResponse;
    onSuccess?: (transaction: TransactionFormData | TransactionUpdateRequest) => void;
    onError?: (error: string) => void;
}

export function useTransactionForm({ transactionData, onSuccess, onError }: TransactionFormProps) {
    const isEditMode = !!transactionData;

    const form = useForm<TransactionFormInput>({
        resolver: zodResolver(AddTransactionWithoutTransformSchema),
        defaultValues: {
            amount: transactionData?.amount.toString() || "0",
            merchant: transactionData?.merchant || "",
        },
    });

    const { reset } = form;

    const memoizedReset = (values: TransactionFormInput) => {
        reset(values);
    };

    useEffect(() => {
        if (transactionData) {
            memoizedReset({
                amount: transactionData.amount.toString(),
                merchant: transactionData.merchant,
            });
        }
    }, [transactionData]);

    const handleSend = async (data: TransactionFormInput) => {
        try {
            const serviceData: TransactionFormData = {
                amount: Number(data.amount),
                merchant: data.merchant,
            };

            if (isEditMode) {
                const updateTransactionData: TransactionUpdateRequest = {
                    amount: serviceData.amount,
                    merchant: serviceData.merchant,
                };
                await updateTransaction(transactionData.id, updateTransactionData);
                onSuccess?.(updateTransactionData);
            } else {
                await addTransaction(serviceData);
                onSuccess?.(serviceData);
            }
        } catch (error) {
            const message = typeof error === "string" ? error : "Error inesperado";
            onError?.(message);
        }
    };

    return {
        isEditMode,
        handleSend: form.handleSubmit(handleSend),
        ...form,
    };
}
