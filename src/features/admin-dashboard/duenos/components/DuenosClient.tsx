"use client"

import { DuenoProvider } from "../context/DuenoContext"
import DuenosList from "./DuenosList"
import DuenoFilters from "./DuenoFilters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DuenosClient() {
  return (
    <DuenoProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Dueños</CardTitle>
            <CardDescription>
              Administra la información de los propietarios de mascotas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <DuenoFilters />
            <DuenosList />
          </CardContent>
        </Card>
      </div>
    </DuenoProvider>
  )
}