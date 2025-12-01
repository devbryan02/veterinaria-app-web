"use client"

import { useState, useCallback } from "react"
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
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import SelectorMap from "./SelectorMap"
import { useDuenoContext } from "../context/DuenoContext"
import { DuenoNewRequest } from "../types"

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  dni: z.string().min(6, "El DNI debe tener al menos 6 caracteres"),
  correo: z.string().email("Email inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
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
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      dni: "",
      correo: "",
      telefono: "",
      direccion: "",
      latitud: "",
      longitud: "",
    },
  })

  const handleMapPositionChange = (position: { lat: number; lng: number }) => {
    form.setValue('latitud', position.lat.toString())
    form.setValue('longitud', position.lng.toString())
  }

  const handleSubmitWithConfirmation = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()

    showConfirmDialog(
      {
        title: "Confirmar registro",
        message: `¿Estás seguro de crear el propietario "${values.nombre}" con DNI ${values.dni}?\n\nEsta acción creará una nueva cuenta de usuario.`,
        buttons: {
          cancel: "Revisar",
          confirm: "Sí, crear"
        }
      },
      handleSubmit
    )
  }, [form, showConfirmDialog])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      const payload: DuenoNewRequest = {
        nombre: values.nombre,
        dni: values.dni,
        correo: values.correo,
        telefono: values.telefono,
        direccion: values.direccion,
        password: values.dni,
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
  }, [createDueno, form, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-5xl h-auto max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl sm:text-2xl">Agregar Nuevo Dueño</DialogTitle>
            <DialogDescription>
              Completa la información del propietario y selecciona su ubicación en el mapa.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Form {...form}>
              <form className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                  {/* Panel Izquierdo - Formulario (2/5 del ancho) */}
                  <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r">
                    <div className="space-y-4">
                      {/* Nombre */}
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

                      {/* DNI y Teléfono en una fila */}
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="dni"
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
                        <FormField
                          control={form.control}
                          name="telefono"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input placeholder="987 654 321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Correo */}
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

                      {/* Dirección */}
                      <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Av. Ejemplo 123, Distrito, Ciudad..."
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Panel Derecho - Mapa (3/5 del ancho) */}
                  <div className="lg:col-span-3 flex flex-col min-h-[400px] lg:min-h-[500px]">
                    <div className="flex-1 p-4">
                      <SelectorMap onPositionChange={handleMapPositionChange} />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              disabled={isSubmitting || loading}
              onClick={handleSubmitWithConfirmation}
            >
              {isSubmitting ? "Guardando..." : "Crear Dueño"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {options && (
        <ConfirmDialog
          open={isOpen}
          onOpenChange={hideConfirmDialog}
          title={options.title}
          message={options.message}
          buttons={options.buttons}
          onConfirm={handleConfirm}
          loading={isSubmitting}
        />
      )}
    </>
  )
}