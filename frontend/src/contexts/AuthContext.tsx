import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login, logout, getAuthHeaders } from '@/services/auth-service.ts';
import { LoginCredentials } from '@/services/auth-service.ts';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    getAuthHeaders: () => { Authorization?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = async (credentials: LoginCredentials) => {
        await login(credentials);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    const values = {
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
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