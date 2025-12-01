import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { ExportDataResponse } from "../types";

export const ExportService = {
  // Exportar reporte de vacunas por dueño
  exportVacunasByDueno: async (duenoId: string): Promise<ExportDataResponse> => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.veterinaria.reportes.exportByDuenoId(duenoId)}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      const filename = ExportService.extractFilename(
        response.headers['content-disposition'],
        `registro_vacunacion_dueno_${duenoId}.xlsx`
      );
      
      return {
        data: response.data,
        filename
      };
    } catch (error) {
      throw new Error('Error al exportar el reporte del dueño');
    }
  },

  // Exportar reporte de todas las vacunas por año
  exportAllVacunas: async (anio: number): Promise<ExportDataResponse> => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.veterinaria.reportes.exportAllData}?anio=${anio}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      const filename = ExportService.extractFilename(
        response.headers['content-disposition'],
        'registro_vacunacion_completo.xlsx'
      );
      
      return {
        data: response.data,
        filename
      };
    } catch (error) {
      throw new Error('Error al exportar el reporte completo');
    }
  },

  // Función auxiliar para extraer filename del header Content-Disposition
  extractFilename: (contentDisposition: string | undefined, fallback: string): string => {
    if (!contentDisposition) return fallback;
    
    const filenameMatch = contentDisposition.match(/filename=(.+)/);
    return filenameMatch ? filenameMatch[1].trim() : fallback;
  },

  // Función auxiliar para descargar el archivo
  downloadFile: (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
};