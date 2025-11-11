"use client"

import { useState, useEffect } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMascotaContext } from "../context/MascotaContext"
import { MascotaDetails, MascotaUpdateRequest } from "../types"

// Esquema de validación con Zod
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  especie: z.string().min(1, "La especie es requerida"),
  raza: z.string().min(1, "La raza es requerida"),
  edad: z.string().min(1, "La edad es requerida"),
  sexo: z.string().min(1, "El sexo es requerido"),
  temperamento: z.string().min(1, "El temperamento es requerido"),
  condicionReproductiva: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
})

interface EditMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mascota: MascotaDetails
}

export default function EditMascotaModal({ open, onOpenChange, mascota }: EditMascotaModalProps) {
  const { updateMascota, loading } = useMascotaContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      especie: "",
      raza: "",
      edad: "",
      sexo: "",
      temperamento: "",
      condicionReproductiva: "",
      color: "",
    },
  })

  useEffect(() => {
    if (open && mascota) {
      form.reset({
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        edad: mascota.edad,
        sexo: mascota.sexo,
        temperamento: mascota.temperamento,
        condicionReproductiva: mascota.condicionreproductiva, 
        color: mascota.color,
      })
    }
  }, [open, mascota, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const payload: MascotaUpdateRequest = {
        nombre: values.nombre,
        especie: values.especie,
        raza: values.raza,
        edad: values.edad,
        sexo: values.sexo,
        temperamento: values.temperamento,
        condicionReproductiva: values.condicionReproductiva,
        color: values.color,
      }

      const success = await updateMascota(mascota.id, payload)
      if (success) {
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Editar Mascota</DialogTitle>
          <DialogDescription>
            Modifica la información de {mascota.nombre}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Información Básica */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Información Básica</h3>
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Max, Luna..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="edad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad</FormLabel>
                      <FormControl>
                        <Input placeholder="2 años..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="especie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Perro">Perro</SelectItem>
                          <SelectItem value="Gato">Gato</SelectItem>
                          <SelectItem value="Ave">Ave</SelectItem>
                          <SelectItem value="Conejo">Conejo</SelectItem>
                          <SelectItem value="Hamster">Hamster</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Macho">Macho</SelectItem>
                          <SelectItem value="Hembra">Hembra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Características Físicas */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Características Físicas</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="raza"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raza</FormLabel>
                      <FormControl>
                        <Input placeholder="Labrador..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Negro, Blanco..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperamento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dócil">Dócil</SelectItem>
                          <SelectItem value="Agresivo">Agresivo</SelectItem>
                          <SelectItem value="Juguetón">Juguetón</SelectItem>
                          <SelectItem value="Tímido">Tímido</SelectItem>
                          <SelectItem value="Protector">Protector</SelectItem>
                          <SelectItem value="Calmado">Calmado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Condición Reproductiva */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Estado Reproductivo</h3>
              <div className="grid grid-cols-1 max-w-md">
                <FormField
                  control={form.control}
                  name="condicionReproductiva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición Reproductiva</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Entero">Entero</SelectItem>
                          <SelectItem value="Castrado">Castrado</SelectItem>
                          <SelectItem value="Esterilizado">Esterilizado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}