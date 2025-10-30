import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { DuenoCreateResponse, DuenoDeleteResponse, DuenoDetails, DuenoNewRequest, DuenoUpdateRequest, DuenoUpdateResponse } from "../types";
import { ApiError } from "@/src/lib/api/axios";
import { OperationResponseStatus } from "@/src/lib/api/types";

// Dueños (Owners) service functions
export async function findAll(): Promise<DuenoDetails[]> {
    try{
        const response = await apiClient.get<DuenoDetails[]>(ENDPOINTS.dueno.list);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener los dueños");
    }
}

export async function create(payload: DuenoNewRequest): Promise<DuenoCreateResponse> {
    try{
        const response = await apiClient.post<DuenoCreateResponse>(ENDPOINTS.dueno.create, payload);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al crear el dueño");
    }
}

export async function findById(id: string): Promise<DuenoDetails> {
    try{
        const response = await apiClient.get<DuenoDetails>(ENDPOINTS.dueno.getById(id));
        return response.data;
    }catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener el dueño por ID");
    }
}

export async function update(id: string, payload: DuenoUpdateRequest): Promise<DuenoUpdateResponse> {

    try{
        const response = await apiClient.patch<DuenoUpdateResponse>(ENDPOINTS.dueno.update(id), payload);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al actualizar el dueño");
    }
}

export async function remove(id: string): Promise<DuenoDeleteResponse> {
    try{
        const response = await apiClient.delete<DuenoDeleteResponse>(ENDPOINTS.dueno.delete(id));
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al eliminar el dueño");
    }
}

export async function searchTerm(term: string): Promise<DuenoDetails[]> {
    try{
        const response = await apiClient.get<DuenoDetails[]>(`${ENDPOINTS.dueno.search}?term=${term}`);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al buscar dueños");
    }
}