"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Syringe } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useVacunaContext } from "../context/VacunaContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import { useMascotaContext } from "../../mascotas/context/MascotaContext"
import { VacunaNewRequest } from "../types"
import SelectMascota from "./SelectMascota"

const formSchema = z.object({
  tipo: z.string().min(1, "El tipo de vacuna es requerido"),
  tipoPersonalizado: z.string().optional(),
  fechaAplicacion: z.string().min(1, "La fecha de aplicación es requerida"),
  mascotaId: z.string().min(1, "Debe seleccionar una mascota"),
  mesesVigencia: z.number().min(1, "Los meses de vigencia son requeridos").max(60, "Máximo 60 meses"),
}).refine((data) => {
  if (data.tipo === "Otra") {
    return data.tipoPersonalizado && data.tipoPersonalizado.trim().length > 0
  }
  return true
}, {
  message: "Debe especificar el tipo de vacuna personalizado",
  path: ["tipoPersonalizado"]
})

interface AddVacunaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddVacunaModal({ open, onOpenChange }: AddVacunaModalProps) {
  const { createVacuna, loading } = useVacunaContext()
  const { getMascotaById } = useMascotaContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fechaVencimientoPreview, setFechaVencimientoPreview] = useState("")
  const [proximaDosisPreview, setProximaDosisPreview] = useState("")
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const getFechaActual = useCallback(() => new Date().toISOString().split('T')[0], [])

  const stringToDate = useCallback((dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }, [])

  const dateToString = useCallback((date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [])

  const calcularFechaVencimiento = useCallback((fechaAplicacion: string, mesesVigencia: number) => {
    if (!fechaAplicacion || !mesesVigencia) return ""
    const fecha = stringToDate(fechaAplicacion)
    fecha.setMonth(fecha.getMonth() + mesesVigencia)
    return dateToString(fecha)
  }, [stringToDate, dateToString])

  const calcularProximaDosis = useCallback((fechaVencimiento: string) => {
    if (!fechaVencimiento) return ""
    const fecha = stringToDate(fechaVencimiento)
    fecha.setDate(fecha.getDate() - 30)
    return dateToString(fecha)
  }, [stringToDate, dateToString])

  const actualizarFechasPreview = useCallback((fechaAplicacion: string, mesesVigencia: number) => {
    if (fechaAplicacion && mesesVigencia) {
      const fechaVencimiento = calcularFechaVencimiento(fechaAplicacion, mesesVigencia)
      setFechaVencimientoPreview(fechaVencimiento)
      if (fechaVencimiento) {
        setProximaDosisPreview(calcularProximaDosis(fechaVencimiento))
      }
    } else {
      setFechaVencimientoPreview("")
      setProximaDosisPreview("")
    }
  }, [calcularFechaVencimiento, calcularProximaDosis])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      tipoPersonalizado: "",
      fechaAplicacion: getFechaActual(),
      mascotaId: "",
      mesesVigencia: 12,
    },
  })

  useEffect(() => {
    if (open) {
      const fechaActual = getFechaActual()
      form.reset({
        tipo: "",
        tipoPersonalizado: "",
        fechaAplicacion: fechaActual,
        mascotaId: "",
        mesesVigencia: 12,
      })
      actualizarFechasPreview(fechaActual, 12)
    } else {
      form.reset()
      setFechaVencimientoPreview("")
      setProximaDosisPreview("")
    }
  }, [open, form, getFechaActual, actualizarFechasPreview])

  const fechaAplicacion = form.watch("fechaAplicacion")
  const mesesVigencia = form.watch("mesesVigencia")
  const tipoSeleccionado = form.watch("tipo")
  const mascotaSeleccionada = form.watch("mascotaId")
  
  useEffect(() => {
    if (fechaAplicacion && mesesVigencia && mesesVigencia > 0) {
      actualizarFechasPreview(fechaAplicacion, mesesVigencia)
    } else {
      setFechaVencimientoPreview("")
      setProximaDosisPreview("")
    }
  }, [fechaAplicacion, mesesVigencia, actualizarFechasPreview])

  const getMascotaNombre = useCallback(async () => {
    if (!mascotaSeleccionada) return "la mascota seleccionada"
    try {
      const mascota = await getMascotaById(mascotaSeleccionada)
      return mascota ? mascota.nombre : "la mascota seleccionada"
    } catch {
      return "la mascota seleccionada"
    }
  }, [mascotaSeleccionada, getMascotaById])

  const handleSubmitWithConfirmation = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()
    const tipoVacuna = values.tipo === "Otra" ? values.tipoPersonalizado : values.tipo
    const mascotaNombre = await getMascotaNombre()

    showConfirmDialog(
      {
        title: "Confirmar registro",
        message: `¿Estás seguro de registrar la vacuna "${tipoVacuna}" para ${mascotaNombre}?\n\nEsta acción no se puede modificar después.`,
        buttons: { cancel: "Revisar", confirm: "Sí, registrar" }
      },
      handleSubmit
    )
  }, [form, showConfirmDialog, getMascotaNombre])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      const payload: VacunaNewRequest = {
        mascotaId: values.mascotaId,
        tipo: values.tipo === "Otra" ? values.tipoPersonalizado || "" : values.tipo,
        fechaAplicacion: values.fechaAplicacion,
        mesesVigencia: values.mesesVigencia,
      }

      const success = await createVacuna(payload)
      if (success) {
        form.reset()
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [createVacuna, form, onOpenChange])

  const tiposVacuna = [
    "Antirrábica", "Parvovirus", "Moquillo", "Hepatitis", "Parainfluenza",
    "Bordetella", "Leptospirosis", "Triple Felina", "Leucemia Felina", "Polivalente", "Otra"
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Syringe className="h-5 w-5" />
              Registrar Nueva Vacuna
            </DialogTitle>
            <DialogDescription>
              Registra la aplicación de una vacuna. Las fechas de vencimiento y próxima dosis se calcularán automáticamente.
            </DialogDescription>
          </DialogHeader>

          {/* Content scrolleable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Form {...form}>
              <div className="space-y-6">
                {/* Sección: Mascota (primero y destacado) */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="mascotaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Mascota</FormLabel>
                        <FormControl>
                          <SelectMascota
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Buscar mascota por nombre"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección: Tipo de Vacuna */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Vacuna</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vacuna</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              if (value !== "Otra") form.setValue("tipoPersonalizado", "")
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tiposVacuna.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {tipoSeleccionado === "Otra" && (
                      <FormField
                        control={form.control}
                        name="tipoPersonalizado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Especificar Vacuna</FormLabel>
                            <FormControl>
                              <Input placeholder="Escriba el tipo de vacuna" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Sección: Aplicación y Vigencia */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Aplicación y Vigencia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fechaAplicacion"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de Aplicación</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(stringToDate(field.value), "PPP", { locale: es })
                                  ) : (
                                    <span>Selecciona fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? stringToDate(field.value) : undefined}
                                onSelect={(date) => date && field.onChange(dateToString(date))}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                defaultMonth={new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mesesVigencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meses de Vigencia</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="12"
                              min={1}
                              max={60}
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sección: Vista Previa de Fechas Calculadas */}
                {(fechaVencimientoPreview || proximaDosisPreview) && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Vista Previa (Calculado automáticamente)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fechaVencimientoPreview && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Fecha de Vencimiento</label>
                          <Input
                            type="date"
                            value={fechaVencimientoPreview}
                            className="bg-muted text-muted-foreground"
                            readOnly
                          />
                        </div>
                      )}

                      {proximaDosisPreview && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Próxima Dosis (Recordatorio)</label>
                          <Input
                            type="date"
                            value={proximaDosisPreview}
                            className="bg-muted text-muted-foreground"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Estas fechas se calcularán y almacenarán automáticamente en el servidor
                    </p>
                  </div>
                )}
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
              {isSubmitting ? "Registrando..." : "Registrar Vacuna"}
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