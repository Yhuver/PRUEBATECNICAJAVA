import { z } from "zod";

const MERCHANT_REQUIRED_MESSAGE = "El comercio es obligatorio.";
const AMOUNT_MAX_ERROR_MESSAGE = "El monto debe ser menor o igual a $" + 2147483647;

const MAX_AMOUNT = 2147483647;

export const AddTransactionSchema = z.object({
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= MAX_AMOUNT, {
            message: AMOUNT_MAX_ERROR_MESSAGE,
        })
        .transform((val) => Number(val)),
    merchant: z.string().min(1, MERCHANT_REQUIRED_MESSAGE),
});

export const AddTransactionWithoutTransformSchema = z.object({
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= MAX_AMOUNT, {
            message: AMOUNT_MAX_ERROR_MESSAGE,
        }),
    merchant: z.string().min(1, MERCHANT_REQUIRED_MESSAGE),
});
