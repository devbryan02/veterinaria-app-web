import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { AuthResponse, LoginRequest } from "../types";
import apiClient, { ApiError } from "@/src/lib/api/axios";
import { tokenStorage } from "@/src/lib/api/token-storage";

// Auth service functions
export async function login(payload: LoginRequest): Promise<AuthResponse> {
    try {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.auth.login, payload);
        
        // Guardar tokens y usuario después del login exitoso
        const { token, user } = response.data;
        tokenStorage.setTokens(token);
        tokenStorage.setUser(user);
        
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al iniciar sesión");
    }
}

export async function logout(): Promise<void> {
    try {
        tokenStorage.clearAll();
    } catch (error) {
        console.error("Error al hacer logout en el servidor:", error);
    } 
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();
    return !!(token && user);
}

// Función para obtener el usuario actual
export function getCurrentUser() {
    return tokenStorage.getUser();
}