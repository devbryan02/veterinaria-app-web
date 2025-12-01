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
  anios: z.number().min(0, "Los años no pueden ser negativos"),
  meses: z.number().min(0, "Los meses no pueden ser negativos").max(11, "Los meses no pueden ser mayores a 11"),
  sexo: z.string().min(1, "El sexo es requerido"),
  temperamento: z.string().min(1, "El temperamento es requerido"),
  condicionReproductiva: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
  estado: z.string().min(1, "El estado es requerido"),
})

interface EditMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mascota: MascotaDetails
}

// Función actualizada para parsear edad del backend en formato "X años Y meses"
const parseEdad = (edadString: string): { anios: number, meses: number } => {
  const defaultReturn = { anios: 0, meses: 0 };
  
  if (!edadString) return defaultReturn;
  
  console.log("Parseando edad:", edadString); // Para debug
  
  // Normalizar el string (remover espacios extra y convertir a minúsculas para matching)
  const normalized = edadString.toLowerCase().trim();
  
  // Caso 1: Solo meses (ej: "4 meses", "0 meses")
  if (normalized.includes('meses') && !normalized.includes('años')) {
    const mesesMatch = normalized.match(/(\d+)\s*meses?/);
    if (mesesMatch) {
      const meses = parseInt(mesesMatch[1]);
      console.log("Solo meses encontrado:", meses); // Debug
      return { anios: 0, meses: meses };
    }
  }
  
  // Caso 2: Solo años (ej: "2 años", "1 año")
  if (normalized.includes('años') && !normalized.includes('meses')) {
    const aniosMatch = normalized.match(/(\d+)\s*años?/);
    if (aniosMatch) {
      const anios = parseInt(aniosMatch[1]);
      console.log("Solo años encontrado:", anios); // Debug
      return { anios: anios, meses: 0 };
    }
  }
  
  // Caso 3: Años y meses (ej: "2 años 4 meses", "1 año 3 meses")
  if (normalized.includes('años') && normalized.includes('meses')) {
    const aniosMatch = normalized.match(/(\d+)\s*años?/);
    const mesesMatch = normalized.match(/(\d+)\s*meses?/);
    
    const anios = aniosMatch ? parseInt(aniosMatch[1]) : 0;
    const meses = mesesMatch ? parseInt(mesesMatch[1]) : 0;
    
    console.log("Años y meses encontrado - años:", anios, "meses:", meses); // Debug
    return { anios, meses };
  }
  
  // Caso 4: Formato legacy con decimales (ej: "4.4 meses") - por si aún hay datos viejos
  if (normalized.includes('meses') && normalized.includes('.')) {
    const match = normalized.match(/(\d+(?:\.\d+)?)\s*meses?/);
    if (match) {
      const totalMeses = parseFloat(match[1]);
      console.log("Formato legacy con decimales:", totalMeses); // Debug
      
      if (totalMeses < 12) {
        return { anios: 0, meses: Math.round(totalMeses) };
      } else {
        const anios = Math.floor(totalMeses / 12);
        const meses = Math.round(totalMeses % 12);
        return { anios, meses };
      }
    }
  }
  
  console.log("No se pudo parsear:", edadString); // Debug
  return defaultReturn;
};

export default function EditMascotaModal({ open, onOpenChange, mascota }: EditMascotaModalProps) {
  const { updateMascota, loading } = useMascotaContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      especie: "",
      raza: "",
      anios: 0,
      meses: 0,
      sexo: "",
      temperamento: "",
      condicionReproductiva: "",
      color: "",
      estado: "ACTIVO", 
    },
  })

  useEffect(() => {
    if (open && mascota) {
      console.log("Datos de mascota recibidos:", mascota); // Debug
      
      const { anios, meses } = parseEdad(mascota.edad);
      console.log("Resultado del parseo - años:", anios, "meses:", meses); // Debug
      
      form.reset({
        nombre: mascota.nombre || "",
        especie: mascota.especie || "",
        raza: mascota.raza || "",
        anios: anios,
        meses: meses,
        sexo: mascota.sexo || "",
        temperamento: mascota.temperamento || "",
        condicionReproductiva: mascota.condicionreproductiva || "",
        color: mascota.color || "",
        estado: "ACTIVO", 
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
        anios: values.anios,
        meses: values.meses,
        sexo: values.sexo,
        temperamento: values.temperamento,
        condicionReproductiva: values.condicionReproductiva,
        color: values.color,
        estado: values.estado,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Mascota</DialogTitle>
          <DialogDescription>
            Modifica la información de {mascota?.nombre || "la mascota"}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Información Básica - Grid compacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              
              {/* Fila 1: Nombre, Especie, Sexo, Estado */}
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
                  name="especie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
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
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVO">Activo</SelectItem>
                          <SelectItem value="FALLECIDO">Fallecido</SelectItem>
                          <SelectItem value="EN_ADOPCION">En Adopción</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fila 2: Raza, Color, Años, Meses */}
              <div className="grid grid-cols-4 gap-4">
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
                  name="anios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Años</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2" 
                          value={field.value || ""}
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
                      <FormLabel>Meses (0-11)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="6" 
                          min="0"
                          max="11"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Características del Comportamiento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comportamiento y Estado Reproductivo</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperamento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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

                <FormField
                  control={form.control}
                  name="condicionReproductiva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición Reproductiva</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}