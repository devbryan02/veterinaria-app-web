"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import { useMascotaContext } from "../context/MascotaContext"
import { useDuenoContext } from "../../duenos/context/DuenoContext"
import { MascotaNewRequest } from "../types"
import SelectDueno from "./SelectDueno"

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  especie: z.string().min(1, "La especie es requerida"),
  especieOtra: z.string().optional(),
  raza: z.string().min(1, "La raza es requerida"),
  anios: z.number().min(0, "Los años deben ser 0 o mayor").max(50, "Los años no pueden ser mayor a 50"),
  meses: z.number().min(0, "Los meses deben ser 0 o mayor").max(11, "Los meses no pueden ser mayor a 11"),
  sexo: z.string().min(1, "El sexo es requerido"),
  temperamento: z.string().min(1, "El temperamento es requerido"),
  condicionReproductiva: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
  usuarioId: z.string().min(1, "Debe seleccionar un dueño"),
})

interface AddMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddMascotaModal({ open, onOpenChange }: AddMascotaModalProps) {
  const { createMascota, loading } = useMascotaContext()
  const { getDuenoById } = useDuenoContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [especieSeleccionada, setEspecieSeleccionada] = useState("")
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      especie: "",
      especieOtra: "",
      raza: "",
      anios: 0,
      meses: 0,
      sexo: "",
      temperamento: "",
      condicionReproductiva: "",
      color: "",
      usuarioId: "",
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setEspecieSeleccionada("")
    }
  }, [open, form])

  const getDuenoNombre = useCallback(async () => {
    const usuarioId = form.getValues("usuarioId")
    if (!usuarioId) return "el propietario seleccionado"
    
    try {
      const dueno = await getDuenoById(usuarioId)
      return dueno ? dueno.nombre : "el propietario seleccionado"
    } catch {
      return "el propietario seleccionado"
    }
  }, [form, getDuenoById])

  const handleSubmitWithConfirmation = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()
    const especieCompleta = values.especie === "Otro" ? values.especieOtra : values.especie
    const duenoNombre = await getDuenoNombre()
    
    const edad = values.anios > 0 || values.meses > 0 
      ? `${values.anios} año${values.anios !== 1 ? 's' : ''} y ${values.meses} mes${values.meses !== 1 ? 'es' : ''}`
      : "menos de 1 mes"

    showConfirmDialog(
      {
        title: "Confirmar registro",
        message: `¿Estás seguro de registrar a "${values.nombre}"?\n\nEspecie: ${especieCompleta}\nEdad: ${edad}\nPropietario: ${duenoNombre}`,
        buttons: {
          cancel: "Revisar",
          confirm: "Sí, registrar"
        }
      },
      handleSubmit
    )
  }, [form, showConfirmDialog, getDuenoNombre])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      const payload: MascotaNewRequest = {
        nombre: values.nombre,
        especie: values.especie === "Otro" ? values.especieOtra || "" : values.especie,
        raza: values.raza,
        anios: values.anios,
        meses: values.meses,
        sexo: values.sexo,
        temperamento: values.temperamento,
        condicionReproductiva: values.condicionReproductiva,
        color: values.color,
        usuarioId: values.usuarioId,
      }

      const success = await createMascota(payload)
      if (success) {
        form.reset()
        setEspecieSeleccionada("")
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [createMascota, form, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl">Agregar Nueva Mascota</DialogTitle>
            <DialogDescription>
              Completa la información de la mascota y asigna su propietario.
            </DialogDescription>
          </DialogHeader>

          {/* Content scrolleable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Form {...form}>
              <div className="space-y-6">
                {/* Sección: Propietario (primero y destacado) */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="usuarioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Propietario</FormLabel>
                        <FormControl>
                          <SelectDueno
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Buscar propietario por nombre o DNI"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección: Identificación */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Identificación</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      name="especie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especie</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              setEspecieSeleccionada(value)
                              if (value !== "Otro") form.setValue("especieOtra", "")
                            }} 
                            value={field.value}
                          >
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

                    {especieSeleccionada === "Otro" && (
                      <FormField
                        control={form.control}
                        name="especieOtra"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Especifica la especie</FormLabel>
                            <FormControl>
                              <Input placeholder="Escribe la especie..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="raza"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raza</FormLabel>
                          <FormControl>
                            <Input placeholder="Labrador, Siamés..." {...field} />
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
                  </div>
                </div>

                {/* Sección: Edad y Características */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Edad y Características</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="anios"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Años</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="50" 
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meses</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="11" 
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
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
                                <SelectValue placeholder="Sexo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MACHO">Macho</SelectItem>
                              <SelectItem value="HEMBRA">Hembra</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condicionReproductiva"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condición</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Condición" />
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

                  <FormField
                    control={form.control}
                    name="temperamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona temperamento" />
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
              {isSubmitting ? "Guardando..." : "Crear Mascota"}
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