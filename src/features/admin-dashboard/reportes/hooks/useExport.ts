import { useState } from 'react';
import { ExportService } from '../service/ExportService';
import { toast } from 'sonner';

export const useExport = () => {
  const [isLoading, setIsLoading] = useState(false);

  const exportVacunasByDueno = async (duenoId: string) => {
    setIsLoading(true);
    try {
      const result = await ExportService.exportVacunasByDueno(duenoId);
      ExportService.downloadFile(result.data, result.filename);
    } catch (error) {
      toast.error('Error al exportar el reporte');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAllVacunas = async (anio: number) => {
    setIsLoading(true);
    try {
      const result = await ExportService.exportAllVacunas(anio);
      ExportService.downloadFile(result.data, result.filename);
    } catch (error) {
      toast.error('Error al exportar el reporte completo');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    exportVacunasByDueno,
    exportAllVacunas,
    isLoading
  };
};