export type OperationResponseStatus = {
    success: boolean;
    message: string;
};

export type ApiErrorResponse = {
    timestamp?: string; 
    status?: number;
    error?: string;
    message?: string;
    path?: string;
    details?: Record<string, unknown>;
};

// Nuevos tipos para operaciones con data
export interface CreateResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface UpdateResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}