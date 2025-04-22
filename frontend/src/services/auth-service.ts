import axios, { AxiosError } from "axios";

const API_URL = 'http://localhost:8080/';
const SIGNIN_ENDPOINT = "/auth/login";

export interface LoginResponse {
    token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await api.post(SIGNIN_ENDPOINT, credentials);
        const { token } = response.data;
        localStorage.setItem('token', token);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || 'Ha occurrido un error al iniciar sesión intente más tarde';
        }
        throw 'Ha ocurrido un error';
    }
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const getAuthHeaders = (): { Authorization?: string } => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};