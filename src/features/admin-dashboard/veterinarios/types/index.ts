import { CreateResponse } from "@/src/lib/api/types";

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  dni: string;
  direccion: string;
}

export interface User {
  id: string;
  nombre: string;
  correo: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: User;
}

export type VetIfoTable = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  dni: string;
  activo: boolean;
  cuentaNoBloqueada: boolean;
}

export type VetCreateResponse = CreateResponse<VetIfoTable>;