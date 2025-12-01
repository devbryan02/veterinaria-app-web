// Tipos para el usuario
export interface User {
  id: string;
  nombre: string;
  correo: string;
  roles: string[];
}

// Tipos para las requests
export interface LoginRequest {
  correo: string;
  password: string;
}

// Tipos para las responses de autenticación
export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

