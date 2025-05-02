import { toast } from 'sonner';
import axios from 'axios';
import { ApiErrorResponse } from "@/interfaces/error-interface.ts";
import { errorMessages } from "@/constants/messages.ts";

type ErrorCode = keyof typeof errorMessages;

interface ToastProps {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    description?: string;
}

export const showToast = ({ type, message, description }: ToastProps) => {
    const options = { description };

    switch (type) {
        case 'success':
            toast.success(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        case 'info':
        default:
            toast(message, options);
            break;
    }
};

export const handleError = (error: unknown): boolean => {
    if (!axios.isAxiosError(error) || !error.response?.data) {
        return false;
    }

    const apiErrorData = error.response.data as ApiErrorResponse;
    const errorCode = apiErrorData.errorCode as ErrorCode | undefined;

    if (errorCode && errorMessages.hasOwnProperty(errorCode)) {
        const { message, submessage } = errorMessages[errorCode];
        showToast({ type: 'error', message, description: submessage });
        return true;
    }

    switch (error.response.status) {
        case 429:
            showToast({
                type: 'info',
                message: '¡Demasiadas solicitudes!',
                description: 'Por favor espera un momento y vuelve a intentar.',
            });
            break;

        case 401:
            if (error.response.data && typeof error.response.data === 'object') {
                const unauthorizedErrorData = error.response.data as ApiErrorResponse;
                if (unauthorizedErrorData.errorCode === 'UNAUTHORIZED') {
                    showToast({
                        type: 'error',
                        message: 'Credenciales incorrectas',
                        description: 'Por favor verifica tu usuario y contraseña.',
                    });
                    return true;
                }
            }
            
            // Mensaje genérico de no autorizado
            showToast({
                type: 'error',
                message: 'No estás autorizado',
                description: 'Por favor inicia sesión nuevamente.',
            });
            break;

        default:
            showToast({
                type: 'error',
                message: 'Ha ocurrido un error',
                description: 'Por favor intenta más tarde.',
            });
            break;
    }

    return true;
};
