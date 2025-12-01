"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/src/shared/components/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  PawPrint,
  Users,
  FileText,
  FileDown,
  Menu,
  LogOut,
  Settings,
  User
} from "lucide-react"
import { AuthGuard } from "@/src/features/auth/context/AuthGuard"
import { useAuthContext } from "@/src/features/auth/context/AuthContext"
import { toast } from "sonner"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/veterinaria",
    icon: LayoutDashboard,
  },
  {
    title: "Dueños",
    href: "/dashboard/veterinaria/duenos",
    icon: Users,
  },
  {
    title: "Mascotas",
    href: "/dashboard/veterinaria/mascotas",
    icon: PawPrint,
  },
  {
    title: "Vacunas",
    href: "/dashboard/veterinaria/vacunas",
    icon: FileText,
  },
  {
    title: "Reportes",
    href: "/dashboard/veterinaria/reportes",
    icon: FileDown,
  },
]

interface VeterinariaLayoutProps {
  children: React.ReactNode
}

export default function VeterinariaLayout({ children }: VeterinariaLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Obtener datos del usuario y función de logout del contexto
  const { user, logout } = useAuthContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Función para manejar el logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await logout()
      toast.success("Sesión cerrada exitosamente")
      router.push('/login')
    } catch (error: any) {
      console.error('Error durante logout:', error)
      // Aunque haya error, el logout debería limpiar tokens localmente
      toast.success("Sesión cerrada")
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden w-64 flex-col border-r lg:flex">
          <div className="flex h-16 items-center border-b px-6">
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
            <div className="ml-2 h-6 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex-1 px-3 py-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center rounded-lg px-3 py-2">
                <div className="h-4 w-4 bg-muted rounded animate-pulse mr-3" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center border-b px-4 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="h-64 w-full bg-muted rounded animate-pulse" />
          </main>
        </div>
      </div>
    )
  }

  // Obtener iniciales del usuario para el avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <PawPrint className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">VetAdmin</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer del sidebar con info del usuario */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.nombre ? getUserInitials(user.nombre) : 'VT'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.nombre || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.correo || 'email@veterinaria.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AuthGuard requiredRoles={['VETERINARIA', 'ADMIN']}>
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex flex-1 items-center justify-between gap-4">
            <h1 className="text-lg font-semibold truncate">Panel de Administración</h1>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {user?.nombre ? getUserInitials(user.nombre) : 'VT'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.nombre || 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.correo || 'email@veterinaria.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  )
}