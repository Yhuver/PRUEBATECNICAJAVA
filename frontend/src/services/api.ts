import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {API_URL, REFRESH_URL} from "@/constants/endpoints";

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
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(api(originalRequest)),
                        reject: (err) => reject(err),
                    });
                });
            }
            isRefreshing = true;
            try {
                const response = await api.post(REFRESH_URL);
                const { accessToken } = response.data;
                processQueue(null, accessToken);
                return api(originalRequest);
            } catch (err ) {
                processQueue(err as string, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    });