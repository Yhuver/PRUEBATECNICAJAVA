import { z } from "zod";

const REQUIRED_FIELD = "Este campo es requerido."
const NO_VALID_EMAIL = "Email no válido";

export const LoginSchema = z
    .object({
        email: z.string({
            required_error: REQUIRED_FIELD,
            invalid_type_error: NO_VALID_EMAIL
        }).email(NO_VALID_EMAIL),

        username: z.string({
            required_error: REQUIRED_FIELD,
        }),

        password: z.string({
            required_error: REQUIRED_FIELD,
        }),

        confirmPassword: z.string({
            required_error: REQUIRED_FIELD
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export const RegisterSchema = z.object({
    email: z.string({
        required_error: REQUIRED_FIELD,
        invalid_type_error: NO_VALID_EMAIL
    }).email(NO_VALID_EMAIL),

    password: z.string({
        required_error: REQUIRED_FIELD,
    }),

})