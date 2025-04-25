import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {API_URL} from "@/constants/endpoints";

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

const interceptorEnabled = true;

if (interceptorEnabled) {

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("Token expired, attempting to refresh...");
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => {
                            resolve(api(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            console.log("Starting token refresh...");
            isRefreshing = true;

            try {
                // await api.post(REFRESH_URL);
                console.log("Token refreshed via httpOnly cookie.");
                processQueue(null, null);
                return api(originalRequest);
            } catch (err) {
                processQueue(null, err);
                return Promise.reject(err);
            } finally {
                console.log("Finished token refresh, resetting isRefreshing...");
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
}