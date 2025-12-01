import axios from "axios";
import { toast } from "sonner";
import type { ApiErrorResponse } from "./types";
import { tokenStorage } from "./token-storage";

// Clase personalizada para errores de API
export class ApiError extends Error {
    public status?: number;
    public data?: ApiErrorResponse;
    
    constructor(message: string, status?: number, data?: ApiErrorResponse) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const apiClient = axios.create({baseURL: "http://localhost:8080/api/v1"});

// Interceptor de solicitud para agregar tokens de autenticación 
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar errores
apiClient.interceptors.response.use(
    (response) => {
        // Respuesta exitosa 
        return response;
    },
    async (error) => {
        // Si el token expiró o es inválido (401 o 403)
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Limpiar tokens y datos de usuario
            tokenStorage.clearAll();
            
            // Mostrar mensaje de sesión expirada
            toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", {
                duration: 4000,
                position: "top-center"
            });
            
            // Redirigir al login después de un pequeño delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
            
            return Promise.reject(error);
        }

        // Manejar errores del servidor
        if (error.response) {
            const { status, data } = error.response;
            
            const apiErrorData: ApiErrorResponse = {
                timestamp: data?.timestamp || new Date().toISOString(),
                status: status,
                error: data?.error || error.response.statusText,
                message: data?.message || `Error ${status}`,
                path: data?.path || error.config?.url,
                details: data?.details || {}
            };
            
            throw new ApiError(
                apiErrorData.message || "Error en la API",
                status,
                apiErrorData
            );
        } else if (error.request) {
            throw new ApiError(
                "Error de conexión - no se pudo conectar al servidor",
                0,
                {
                    timestamp: new Date().toISOString(),
                    status: 0,
                    error: "Network Error",
                    message: "No se pudo conectar al servidor",
                    path: error.config?.url
                }
            );
        } else {
            throw new ApiError(
                error.message || "Error desconocido",
                undefined,
                {
                    timestamp: new Date().toISOString(),
                    error: "Request Error",
                    message: error.message || "Error al configurar la petición"
                }
            );
        }
    }
);

export default apiClient;