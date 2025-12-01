import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { ApiError } from "@/src/lib/api/axios";
import type { OperationResponseStatus, CreateResponse } from "@/src/lib/api/types";
import type { RegisterRequest, AuthResponse, VetIfoTable, VetCreateResponse } from "../types";

export async function registerVeterinarian(data: RegisterRequest): Promise<VetCreateResponse> {
    try {
        const response = await apiClient.post<VetCreateResponse>(ENDPOINTS.admin.veterinaria.create, data);
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al registrar el veterinario");
    }
}

export async function getVeterinarians(): Promise<VetIfoTable[]> {
    try {
        const response = await apiClient.get<VetIfoTable[]>(ENDPOINTS.admin.veterinaria.list);
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener los veterinarios");
    }
}

export async function toggleVeterinarianStatus(id: string): Promise<OperationResponseStatus> {
    try {
        const response = await apiClient.patch<OperationResponseStatus>(ENDPOINTS.admin.veterinaria.block(id));
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al cambiar el estado del veterinario");
    }
}

export async function getVeterinarianById(id: string): Promise<VetIfoTable> {
    try {
        const response = await apiClient.get<VetIfoTable>(ENDPOINTS.admin.veterinaria.getById(id));
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener el veterinario por ID");
    }
}