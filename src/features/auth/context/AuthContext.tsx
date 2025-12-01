"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

// Crear el contexto
const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

// Provider del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const auth = useAuth();
    
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};