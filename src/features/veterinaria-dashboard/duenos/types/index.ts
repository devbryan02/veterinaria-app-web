import { CreateResponse, UpdateResponse, DeleteResponse } from '@/src/lib/api/types';

export type DuenoNewRequest = {
    nombre: string;
    dni: string;
    direccion: string;
    telefono: string;
    correo: string;
    password: string;
    latitud: string;
    longitud: string;
};

export type DuenoDetails = {
    id: string;
    nombre: string;
    dni: string;
    direccion: string;
    telefono: string;
    correo: string;
    cantidadmascotas: number;
}

export type DuenoUpdateIgnorePasswordAndLocation = {
    nombre: string;
    dni: string;
    direccion: string;
    telefono: string;
    correo: string;
};

// Tipos de respuesta específicos para Dueño
export type DuenoCreateResponse = CreateResponse<DuenoDetails>;
export type DuenoUpdateResponse = UpdateResponse<DuenoDetails>;
export type DuenoDeleteResponse = DeleteResponse;

export type MascotaDetalle = {
    id: string;
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
};

export type MascotaResume = {
    cantidadMascotas: number;
    mascotasList: MascotaDetalle[];
};

export type DuenoFullDetails = {
    nombre: string;
    dni: string;
    direccion: string;
    telefono: string;
    correo: string;
    longitud: string;
    latitud: string;
    mascota: MascotaResume;
};