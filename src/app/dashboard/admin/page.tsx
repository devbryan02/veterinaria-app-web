import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, Users, FileText, Calendar, TrendingUp, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Mascotas",
      value: "1,234",
      description: "+20.1% desde el mes pasado",
      icon: PawPrint,
      color: "text-blue-600"
    },
    {
      title: "Dueños Registrados",
      value: "892",
      description: "+15.3% desde el mes pasado",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Consultas Hoy",
      value: "23",
      description: "8 pendientes",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Ingresos del Mes",
      value: "$12,450",
      description: "+8.2% desde el mes pasado",
      icon: DollarSign,
      color: "text-purple-600"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "Nueva mascota registrada",
      description: "Max - Golden Retriever registrado por María García",
      time: "Hace 2 horas"
    },
    {
      id: 2,
      type: "Consulta completada",
      description: "Revisión general para Luna - Gato Persa",
      time: "Hace 3 horas"
    },
    {
      id: 3,
      type: "Nuevo dueño registrado",
      description: "Carlos López se registró en el sistema",
      time: "Hace 5 horas"
    },
    {
      id: 4,
      type: "Reporte generado",
      description: "Reporte mensual de vacunaciones",
      time: "Hace 1 día"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general de la clínica veterinaria
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas actividades en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Atajos para tareas comunes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <PawPrint className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Registrar Mascota</span>
                </div>
              </Card>
              <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Nuevo Dueño</span>
                </div>
              </Card>
              <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Generar Reporte</span>
                </div>
              </Card>
              <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Ver Estadísticas</span>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}