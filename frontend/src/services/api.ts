import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_URL, REFRESH_URL, SIGNING_URL, SIGNUP_URL } from "@/constants/endpoints";
import { handleError } from "@/components/atoms/toastHandler.ts";

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

        if (!originalRequest) {
            handleError(error);
            return Promise.reject(error);
        }

        // Obtener la URL completa de la solicitud original
        const requestUrl = originalRequest.url || '';
        
        // No intentar refrescar el token para rutas de autenticación
        const isAuthRoute = requestUrl.includes(SIGNING_URL) || requestUrl.includes(SIGNUP_URL);
        
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers = {
                                ...originalRequest.headers,
                                Authorization: `Bearer ${token}`,
                            };
                            resolve(api(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const response = await api.post(REFRESH_URL);
                const { accessToken } = response.data;

                processQueue(accessToken, null);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`,
                };

                return api(originalRequest);
            } catch (err) {
                processQueue(null, err);
                handleError(error);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        handleError(error);

        return Promise.reject(error);
    }
);
