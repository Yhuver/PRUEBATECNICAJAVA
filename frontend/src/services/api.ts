import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {API_URL, REFRESH_URL} from "@/constants/endpoints";
import {handleError} from "@/components/atoms/toastHandler.ts";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (token: string | null, error: unknown) => {
    failedQueue.forEach((prom) => {
        if (token) prom.resolve(token);
        else prom.reject(error);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Manejo de error 429: demasiadas solicitudes
        if (error.response?.status === 429) {
            handleError(error);  // Mostrar toast solo una vez
            return Promise.reject(error);
        }

        // Manejo de error 401: no autorizado
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Si ya se está refrescando el token, encolamos la solicitud
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(api(originalRequest)), // Reintentar la solicitud original
                        reject: (err) => reject(err), // Rechazar si hay un error
                    });
                });
            }

            // Si no se está refrescando el token, iniciamos el proceso de refresco
            isRefreshing = true;

            try {
                // Intentamos obtener un nuevo token de acceso
                const response = await api.post(REFRESH_URL);
                const { accessToken } = response.data;

                // Actualizamos el token en las peticiones fallidas en la cola
                processQueue(accessToken, null);

                // Reintentar la solicitud original (sin necesidad de modificar los headers)
                return api(originalRequest);
            } catch (err) {
                // Si ocurre un error en el refresco, procesamos la cola y rechazamos el error
                processQueue(null, err);
                handleError(err);  // Aquí solo se muestra un toast de error si la renovación falla
                return Promise.reject(err);
            } finally {
                isRefreshing = false; // Terminamos el proceso de refresco
            }
        }

        // Si no es un error 401 ni 429, mostramos el error genérico
        handleError(error);
        return Promise.reject(error);
    }
);

