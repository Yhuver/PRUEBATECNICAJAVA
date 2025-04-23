import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {login, logout, register} from '@/services/auth-service.ts';
import {LoginRequest, RegisterRequest} from "@/interfaces/auth-interface.ts";
import {getAuthHeaders} from "@/services/api.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (credentials: RegisterRequest) => void;
    logout: () => void;
    getAuthHeaders: () => { Authorization?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = async (credentials: LoginRequest) => {
        await login(credentials);
        setIsAuthenticated(true);
    };

    const handleRegister = async (credentials: RegisterRequest) => {
        await register(credentials);
        setIsAuthenticated(true);
    }

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    const values = {
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        getAuthHeaders,
    };

    return <AuthContext.Provider value={values} >{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};