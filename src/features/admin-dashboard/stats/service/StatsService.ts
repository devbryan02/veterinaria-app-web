import apiClient from "@/src/lib/api/axios";
import { EstadisticasDashboard } from "../types/Index";
import { ENDPOINTS } from "@/src/lib/api/endpoint";

export async function getDashboardStats(): Promise<EstadisticasDashboard> {
    try {
        const response = await apiClient.get<EstadisticasDashboard>(ENDPOINTS.admin.stats.overview);
        return response.data;
    }catch (error) {
        console.error("Error obteniendo stats:", error);
        throw error;
    }
}



