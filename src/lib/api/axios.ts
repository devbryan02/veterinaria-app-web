import axios from "axios";
import type { ApiErrorResponse } from "./types";

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

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de solicitud para agregar tokens de autenticación 
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
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
    (error) => {
        // Manejar errores del servidor
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const { status, data } = error.response;
            
            // Normalizar la respuesta de error según tu ApiErrorResponse
            const apiErrorData: ApiErrorResponse = {
                timestamp: data?.timestamp || new Date().toISOString(),
                status: status,
                error: data?.error || error.response.statusText,
                message: data?.message || `Error ${status}`,
                path: data?.path || error.config?.url,
                details: data?.details || {}
            };
            
            // Lanzar error personalizado
            throw new ApiError(
                apiErrorData.message || "Error en la API",
                status,
                apiErrorData
            );
        } else if (error.request) {
            // La petición se hizo pero no se recibió respuesta (error de red)
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
            // Algo pasó al configurar la petición
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