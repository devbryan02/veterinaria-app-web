"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useDuenoContext } from "../context/DuenoContext"
import { DuenoNewRequest } from "../types"

// Esquema de validación con Zod
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  DNI: z.string().min(1, "El DNI es requerido"),
  correo: z.string().email("Email inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
})

interface AddDuenoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddDuenoModal({ open, onOpenChange }: AddDuenoModalProps) {
  const { createDueno, loading } = useDuenoContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configuración del formulario con React Hook Form y Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      DNI: "",
      correo: "",
      telefono: "",
      direccion: "",
      password: "",
      latitud: "",
      longitud: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const payload: DuenoNewRequest = {
        nombre: values.nombre,
        DNI: values.DNI,
        correo: values.correo,
        telefono: values.telefono,
        direccion: values.direccion,
        password: values.password,
        latitud: values.latitud || "",
        longitud: values.longitud || "",
      }

      const success = await createDueno(payload)
      if (success) {
        form.reset()
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Dueño</DialogTitle>
          <DialogDescription>
            Completa la información del propietario de la mascota.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="DNI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="juan@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Calle, ciudad, código postal..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitud (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="-12.0464" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitud (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="-77.0428" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}