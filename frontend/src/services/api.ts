import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {API_URL, REFRESH_URL} from "@/constants/endpoints";
import {HOME_ROUTE} from "@/constants/routes.ts";

export const api = axios.create({
    baseURL: API_URL,
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

export const getAuthHeaders = (): { Authorization?: string } => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers)
                                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const res = await axios.post(`${REFRESH_URL}`, {
                    refreshToken,
                });

                const newToken = res.data.token;
                localStorage.setItem("accessToken", newToken);
                processQueue(newToken, null);
                if (originalRequest.headers)
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (err) {
                processQueue(null, err);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = HOME_ROUTE;
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);