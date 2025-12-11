# Veterinaria App Web

Sistema de gestión integral para clínicas veterinarias construido con Next.js 16, React 19 y TypeScript.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Arquitectura](#arquitectura)
- [Gestión de Dependencias](#gestión-de-dependencias)

- [Contribuir](#contribuir)

## Características

### Panel de Administrador
- Gestión de veterinarios
- Registro y autenticación de usuarios
- Control de accesos por roles

### Panel de Veterinaria
- **Gestión de Mascotas**: CRUD completo con soporte de imágenes
- **Gestión de Dueños**: Registro con geolocalización en mapa interactivo
- **Control de Vacunas**: Seguimiento de vacunación y calendario
- **Reportes y Estadísticas**: Visualización de datos con gráficos
- **Exportación de Datos**: Generación de PDFs y reportes
- **Mapas Interactivos**: Ubicación de dueños con Leaflet

## Tecnologías

### Core
- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first

### UI/UX
- **Radix UI** - Componentes accesibles headless
- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualización de datos
- **Next Themes** - Gestión de temas (light/dark mode)
- **Sonner** - Notificaciones toast

### Mapas y Geolocalización
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración de Leaflet con React
- **Leaflet Draw** - Herramientas de dibujo en mapas

### Formularios y Validación
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **@hookform/resolvers** - Integración de validadores

### Utilidades
- **Axios** - Cliente HTTP
- **date-fns** - Manipulación de fechas
- **js-cookie** - Gestión de cookies
- **QRCode** - Generación de códigos QR
- **@react-pdf/renderer** - Generación de PDFs

## Requisitos Previos

- **Node.js**: 20.x o superior
- **npm**: 9.x o superior
- **Git**: Para control de versiones

## Instalación

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd veterinaria-app-web
```

### 2. Instalar dependencias

**IMPORTANTE**: Usa `npm ci` en lugar de `npm install` para asegurar que se instalen las versiones exactas de las dependencias especificadas en `package-lock.json`. Esto garantiza consistencia entre todos los desarrolladores.

```bash
npm ci
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── dashboard/               # Rutas protegidas
│   │   ├── admin/              # Panel de administrador
│   │   │   ├── veterinarios/  # Gestión de veterinarios
│   │   │   └── ...
│   │   └── veterinaria/        # Panel de veterinaria
│   │       ├── duenos/        # Gestión de dueños
│   │       ├── mascotas/      # Gestión de mascotas
│   │       ├── vacunas/       # Gestión de vacunas
│   │       └── reportes/      # Reportes y estadísticas
│   ├── login/                  # Página de autenticación
│   └── page.tsx               # Landing page
│
├── features/                    # Funcionalidades por dominio
│   ├── admin-dashboard/        # Lógica del panel admin
│   │   └── veterinarios/
│   │       ├── components/    # Componentes UI
│   │       ├── context/       # Context API
│   │       ├── hooks/         # Custom hooks
│   │       ├── service/       # Servicios API
│   │       └── types/         # TypeScript types
│   │
│   ├── auth/                   # Autenticación y autorización
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── service/
│   │   └── types/
│   │
│   ├── landing/                # Landing page
│   │   ├── components/
│   │   ├── data/
│   │   └── types/
│   │
│   └── vet-dashboard/          # Lógica del panel veterinaria
│       ├── duenos/
│       ├── mascotas/
│       ├── vacunas/
│       ├── reportes/
│       └── stats/
│
├── lib/                         # Utilidades y configuraciones
│   ├── api/                    # Configuración de Axios
│   │   ├── axios.ts           # Instancia configurada
│   │   ├── endpoint.ts        # Endpoints de la API
│   │   ├── token-storage.ts   # Gestión de tokens
│   │   └── types.ts           # Tipos comunes de API
│   └── utils/                  # Funciones auxiliares
│       ├── dim-generador.tsx  # Generadores varios
│       └── utils.ts           # Utilidades generales
│
├── shared/                      # Componentes y hooks compartidos
│   ├── components/
│   │   ├── ConfirmDialog.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── hooks/
│       └── useConfirmDialog.ts
│
└── styles/
    └── globals.css             # Estilos globales
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en puerto 3000

# Producción
npm run build        # Compila la aplicación para producción
npm run start        # Inicia el servidor de producción

# Código
npm run lint         # Ejecuta ESLint para análisis de código
```

## Arquitectura

### Patrón de Diseño

El proyecto sigue una arquitectura basada en **Feature-Sliced Design**, donde cada funcionalidad está encapsulada en su propio módulo con:

- **Components**: Componentes React específicos de la feature
- **Context**: Estado global usando Context API
- **Hooks**: Lógica reutilizable con custom hooks
- **Service**: Comunicación con la API
- **Types**: Definiciones TypeScript

### Flujo de Datos

```
UI Component → Custom Hook → Service → API
                    ↓
                 Context (Estado Global)
```

### Autenticación

- Sistema basado en JWT tokens
- Almacenamiento seguro en cookies
- Guards de ruta con `AuthGuard`
- Renovación automática de tokens

### Gestión de Estado

- **Context API** para estado global por feature
- **React Hook Form** para formularios
- **Custom Hooks** para lógica reutilizable

## Gestión de Dependencias

### Instalación de nuevas dependencias

```bash
npm install [nombre-paquete]
git add package.json package-lock.json
git commit -m "feat: add [nombre-paquete] dependency"
```

### Actualización de dependencias

```bash
npm update              # Actualiza según rangos permitidos
npm ci                  # Verifica que todo funciona
npm run build          # Prueba que la build funciona
git add package-lock.json
git commit -m "chore: update dependencies"
```

### Reglas importantes

1. **SIEMPRE usa `npm ci`** para instalar dependencias al clonar el repo
2. **NO modifiques manualmente** `package-lock.json`
3. **COMMITEA siempre** `package-lock.json` junto con `package.json`
4. **NO uses** `npm install` para setup inicial, solo `npm ci`

### ¿Por qué usar `npm ci`?

- Instala exactamente las versiones especificadas en `package-lock.json`
- Ignora los rangos de versiones (`^`, `~`) del `package.json`
- Garantiza que todos los desarrolladores tengan las mismas versiones
- Es más rápido que `npm install`
- Evita bugs por diferencias de versiones entre entornos

## Contribuir

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan el código)
refactor: refactorización de código
test: añadir o modificar tests
chore: tareas de mantenimiento
```

### Workflow de desarrollo

1. Crea una rama desde `main`:
   ```bash
   git checkout -b feature/nombre-feature
   ```

2. Realiza tus cambios y commits:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. Push y crea un Pull Request:
   ```bash
   git push origin feature/nombre-feature
   ```

4. Espera revisión y aprobación del código

### Estándares de Código

- Usa TypeScript para tipado fuerte
- Sigue las reglas de ESLint configuradas
- Escribe componentes funcionales con hooks
- Documenta funciones complejas
- Mantén componentes pequeños y reutilizables

---

**Versión**: 0.1.0  
**Licencia**: Private  
**Estado**: En desarrollo