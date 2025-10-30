/**
 * Centralized API Endpoints Configuration
 * Base URL se configura en el client.ts
 */

export const ENDPOINTS = {

  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Dueños (Owners) endpoints
  dueno: {
    list: '/dueno',
    create: '/dueno',
    getById: (id: string) => `/dueno/${id}`,
    update: (id: string) => `/dueno/${id}`,
    delete: (id: string) => `/dueno/${id}`,
    search: '/dueno/search',
    // Mascotas de un dueño específico
    mascotas: (duenoId: string) => `/dueno/${duenoId}/mascotas`,
  },

  // Mascotas (Pets) endpoints
  mascota: {
    list: '/mascota',
    create: '/mascota',
    getById: (id: number) => `/mascota/${id}`,
    update: (id: number) => `/mascota/${id}`,
    delete: (id: number) => `/mascota/${id}`,
    search: '/mascota/search',
    // Vacunas de una mascota específica
    vacunas: (mascotaId: number) => `/mascota/${mascotaId}/vacunas`,
    // Historial médico
    historial: (mascotaId: number) => `/mascota/${mascotaId}/historial`,
  },
} as const

/**
 * Helper function para construir query params
 * Ejemplo: buildQueryString({ page: 1, limit: 10 }) => "?page=1&limit=10"
 */
export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Type helpers para autocompletado
 */
export type EndpointKeys = keyof typeof ENDPOINTS
export type AuthEndpoints = typeof ENDPOINTS.auth
export type DuenoEndpoints = typeof ENDPOINTS.dueno
export type MascotaEndpoints = typeof ENDPOINTS.mascota
