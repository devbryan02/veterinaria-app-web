import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { DuenoCreateResponse, DuenoDeleteResponse, DuenoDetails, DuenoFullDetails, DuenoNewRequest, DuenoUpdateIgnorePasswordAndLocation, DuenoUpdateResponse } from "../types";
import { ApiError } from "@/src/lib/api/axios";

// Dueños (Owners) service functions
export async function findAll(): Promise<DuenoDetails[]> {
    try{
        const response = await apiClient.get<DuenoDetails[]>(ENDPOINTS.veterinaria.duenios.list);
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
        const response = await apiClient.post<DuenoCreateResponse>(ENDPOINTS.veterinaria.duenios.create, payload);
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
        const response = await apiClient.get<DuenoDetails>(ENDPOINTS.veterinaria.duenios.getById(id));
        return response.data;
    }catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener el dueño por ID");
    }
}

export async function updateIgnorePasswordAndLocation(payload: DuenoUpdateIgnorePasswordAndLocation, id: string): Promise<DuenoUpdateResponse> {

    try{
        const response = await apiClient.put<DuenoUpdateResponse>(ENDPOINTS.veterinaria.duenios.update(id), payload);
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
        const response = await apiClient.delete<DuenoDeleteResponse>(ENDPOINTS.veterinaria.duenios.delete(id));
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
        const response = await apiClient.get<DuenoDetails[]>(`${ENDPOINTS.veterinaria.duenios.search}?term=${term}`);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al buscar dueños");
    }
}

export async function getDuenoDetails(id: string): Promise<DuenoFullDetails> {
    try {
        const response = await apiClient.get<DuenoFullDetails>(ENDPOINTS.veterinaria.duenios.details(id));
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener los detalles del dueño");
    }
}