import React, {createContext, useState, ReactNode} from 'react';
import {login, logout, register} from '@/services/auth-service.ts';
import {LoginRequest, RegisterRequest} from "@/interfaces/auth-interface.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (credentials: RegisterRequest) => void;
    logout: () => void;
    // loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    // const [loading, setLoading] = useState(true);
    //

    const handleLogin = async (credentials: LoginRequest) => {
        await login(credentials);
        setIsAuthenticated(true);
    };

    const handleRegister = async (credentials: RegisterRequest) => {
        await register(credentials);
        setIsAuthenticated(true);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const values = {
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        // loading,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};