import { toast } from 'sonner';
import axios from 'axios';

interface ToastProps {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    description?: string;
}

export const showToast = ({ type, message, description }: ToastProps) => {
    if (type === 'success') {
        toast.success(message, { description });
    } else if (type === 'error') {
        toast.error(message, { description });
    } else if (type === 'info') {
        toast(message, { description });
    }
};

export const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
            case 429:
                showToast({
                    type: 'info',
                    message: '¡Demasiadas solicitudes!',
                    description: 'Por favor espera un momento y vuelve a intentar.',
                });
                break;
            case 401:
                showToast({
                    type: 'error',
                    message: 'No estás autorizado',
                    description: 'Por favor inicia sesión nuevamente.',
                });
                break;


            default:
                showToast(
                    { type: 'error', message: 'Ha ocurrido un error', description: 'Por favor intenta más tarde.' });
        }
    }
}
