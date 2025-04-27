import {z} from "zod";

const REQUIRED_FIELD = "Este campo es requerido."
const NO_VALID_EMAIL = "Correo electrónico no válido.";
const PASSWORD_DOESNT_MATCH = "Las contraseñas no coinciden"

export const LoginSchema = z
    .object({
        email: z.string({
            required_error: REQUIRED_FIELD,
            invalid_type_error: NO_VALID_EMAIL
        }).email(NO_VALID_EMAIL),
        password: z.string({
            required_error: REQUIRED_FIELD,
        })

    })

export const RegisterSchema = z.object({
    email: z.string({
        required_error: REQUIRED_FIELD,
        invalid_type_error: NO_VALID_EMAIL
    }).email(NO_VALID_EMAIL),

    fullName: z.string({
        required_error: REQUIRED_FIELD,
    }),

    password: z.string({
        required_error: REQUIRED_FIELD,
    }),

    confirmPassword: z.string({
        required_error: REQUIRED_FIELD
    }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: PASSWORD_DOESNT_MATCH,
});