import { api } from "@/services/api.ts"
import {AxiosError} from "axios";

import {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse
} from "@/interfaces/auth-interface.ts";
import {
    CHECK_URL,
    LOGOUT_URL, REFRESH_URL,
    SIGNING_URL,
    SIGNUP_URL
} from "@/constants/endpoints.ts";


export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await api.post(SIGNING_URL, credentials);
        localStorage.setItem("hasSession", "true");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || 'Ha occurrido un error al iniciar sesión intente más tarde';
        }
        throw 'Ha ocurrido un error';
    }
};

export const register = async (credentials: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await api.post(SIGNUP_URL, credentials);
        localStorage.setItem("hasSession", "true");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || 'Ha occurrido un error al iniciar sesión intente más tarde';
        }
    }
    throw 'Ha ocurrido un error';
}

export const logout = async (): Promise<void> => {
    localStorage.removeItem("hasSession");
    try {
        const response = await api.post(LOGOUT_URL);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || 'Ha ocurrido un error al cerrar sesión intente más tarde';
        }
    }
};

export const checkSession = async (): Promise<void> => {
    try {
        const response = await api.get(CHECK_URL);
        return response.data;
    }
    catch (error){
        if (error instanceof  AxiosError){
            throw error.response?.data || "Ha ocurrido un error al verificar la sesión."
        }
    }
}

export const refreshSession = async (): Promise<void> => {
    try {
        const response = await api.post(REFRESH_URL);
        return response.data;
    }
    catch (error){
        if (error instanceof  AxiosError){
            throw error.response?.data || "Ha ocurrido un error al refrescar la sesión la sesión."
        }
    }
}


