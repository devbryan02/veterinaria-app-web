import { CreateResponse, UpdateResponse, DeleteResponse } from '@/src/lib/api/types';

export type MascotaNewRequest = {
    nombre: string;
    especie: string;
    raza: string;
    edad: string;
    sexo: string;
    temperamento: string;
    condicionReproductiva: string;
    color: string;
    duenoId: string;
}

export type MascotaDetails = {
    id: string;
    nombre: string;
    especie: string;
    raza: string;
    edad: string;
    sexo: string;
    temperamento: string;
    condicionreproductiva: string;
    color: string;
    dueno: string;
    identificador: string;
}

export type MascotaUpdateRequest = {
    nombre: string;
    especie: string;
    raza: string;
    edad: string;
    sexo: string;
    temperamento: string;
    condicionReproductiva: string;
    color: string;
};

// Tipos de respuesta específicos para Mascota
export type MascotaCreateResponse = CreateResponse<MascotaDetails>;
export type MascotaUpdateResponse = UpdateResponse<MascotaDetails>;
export type MascotaDeleteResponse = DeleteResponse;


