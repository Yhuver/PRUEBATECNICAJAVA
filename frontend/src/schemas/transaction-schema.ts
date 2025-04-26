import { z } from "zod";

const AMOUNT_ERROR_MESSAGE = "El monto debe ser un número mayor o igual a 0";
const MERCHANT_REQUIRED_MESSAGE = "El comercio es obligatorio";

export const AddTransactionSchema = z.object({
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: AMOUNT_ERROR_MESSAGE,
        })
        .transform((val) => Number(val)),
    merchant: z.string().min(1, MERCHANT_REQUIRED_MESSAGE),
});

export const AddTransactionWithoutTransformSchema = z.object({
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: AMOUNT_ERROR_MESSAGE,
        }),
    merchant: z.string().min(1, MERCHANT_REQUIRED_MESSAGE),
});

export const UpdateTransactionSchema = z.object({
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: AMOUNT_ERROR_MESSAGE,
        })
        .transform((val) => Number(val)),
    merchant: z.string().min(1, MERCHANT_REQUIRED_MESSAGE),
});
