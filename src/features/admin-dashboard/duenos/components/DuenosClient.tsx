"use client"

import { DuenoProvider } from "../context/DuenoContext"
import DuenosList from "./DuenosList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield } from "lucide-react"

export default function DuenosClient() {
  return (
    <DuenoProvider>
      <div className="space-y-6">
        <Card className="border-0 shadow-sm bg-linear-to-r from-background to-muted/20">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    Gestión de Dueños
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Administra la información de los propietarios de mascotas
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
            <DuenosList />
          </CardContent>
        </Card>
      </div>
    </DuenoProvider>
  )
}