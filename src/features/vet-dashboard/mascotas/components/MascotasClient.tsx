"use client"

import { MascotaProvider } from "../context/MascotaContext"
import { DuenoProvider } from "../../duenos/context/DuenoContext"
import MascotasList from "./MascotasList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield } from "lucide-react"

export default function MascotasClient() {
  return (
    <DuenoProvider>
      <MascotaProvider>
        <div className="space-y-6">
          <Card className="border-0 shadow-sm bg-linear-to-r from-background to-muted/20">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      Gestión de Mascotas
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      Administra la información de las mascotas registradas en el sistema
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Shield className="h-3 w-3" />
                    Sistema Activo
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <MascotasList />
            </CardContent>
          </Card>
        </div>
      </MascotaProvider>
    </DuenoProvider>
  )
}