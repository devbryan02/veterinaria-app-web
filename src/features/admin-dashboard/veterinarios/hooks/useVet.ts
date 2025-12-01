import { useState, useCallback } from 'react';
import { getVeterinarians, registerVeterinarian, toggleVeterinarianStatus, getVeterinarianById } from '../service/VetService';
import { VetIfoTable, RegisterRequest, VetCreateResponse } from '../types';
import {OperationResponseStatus } from '@/src/lib/api/types';
import { toast } from "sonner";

// Definición de la interfaz para el hook useVet
interface UseVetReturn {
    veterinarians: VetIfoTable[];
    loading: boolean;
    error: string | null;
    getVets: () => Promise<void>;
    getVetById: (id: string) => Promise<VetIfoTable | null>;
    createVet: (payload: RegisterRequest) => Promise<boolean>;
    toggleVetStatus: (id: string) => Promise<boolean>;
    clearError: () => void;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Ocurrió un error inesperado';
}

const useVet = (): UseVetReturn => {

    // Estado para veterinarios, carga y errores
    const [veterinarians, setVeterinarians] = useState<VetIfoTable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para limpiar errores
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Obtener lista de veterinarios
    const getVets = useCallback(async (): Promise<void> => {
        setLoading(true);
        clearError();
        try {
            const data = await getVeterinarians();
            setVeterinarians(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar veterinarios: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Obtener veterinario por ID
    const getVetById = useCallback(async (id: string): Promise<VetIfoTable | null> => {
        setLoading(true);
        clearError();
        try {
            const data = await getVeterinarianById(id);
            return data;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar el veterinario: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Crear nuevo veterinario
    const createVet = useCallback(async (payload: RegisterRequest): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: VetCreateResponse = await registerVeterinarian(payload);

            if (response.success) {
                await getVets();
                toast.success(`El veterinario ${payload.nombre} ha sido registrado exitosamente`);
                return true;
            }

            const message = response.message || 'Error al registrar el veterinario';
            setError(message);
            toast.error(message);
            return false;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearError, getVets]);

    // Bloquear/Desbloquear veterinario
    const toggleVetStatus = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: OperationResponseStatus = await toggleVeterinarianStatus(id);

            if (response.success) {
                // Obtener los datos frescos del servidor después del cambio
                const updatedVet = await getVeterinarianById(id);
                if (updatedVet) {
                    // Actualizar solo ese veterinario con los datos reales del servidor
                    setVeterinarians(prev => prev.map(vet => 
                        vet.id === id ? updatedVet : vet
                    ));
                } else {
                    // Si falla obtener el veterinario específico, refrescar toda la lista
                    await getVets();
                }
                
                toast.success(response.message || "Estado de la cuenta actualizado exitosamente");
                return true;
            }

            const message = response.message || 'Error al cambiar el estado de la cuenta';
            setError(message);
            toast.error(message);
            return false;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearError, getVets]);

    return {
        // Estados 
        veterinarians,
        loading,
        error,
        // Métodos
        getVets,
        getVetById,
        createVet,
        toggleVetStatus,
        clearError,
    };
};

export default useVet;