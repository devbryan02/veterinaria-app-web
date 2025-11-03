"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, Phone, Mail, IdCard } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDuenoContext } from "../context/DuenoContext"
import EditDuenoModal from "./EditDuenoModal"
import { DuenoDetails } from "../types"

export default function DuenosList() {
  const { duenos, loading, error, getDuenos, deleteDueno } = useDuenoContext()
  const [selectedDueno, setSelectedDueno] = useState<DuenoDetails | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [duenoToDelete, setDuenoToDelete] = useState<DuenoDetails | null>(null)

  useEffect(() => {
    getDuenos()
  }, [getDuenos])

  const handleEdit = (dueno: DuenoDetails) => {
    setSelectedDueno(dueno)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (dueno: DuenoDetails) => {
    setDuenoToDelete(dueno)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (duenoToDelete) {
      await deleteDueno(duenoToDelete.id)
      setIsDeleteDialogOpen(false)
      setDuenoToDelete(null)
    }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={getDuenos} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Mascotas</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingSkeleton />
            ) : duenos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No se encontraron dueños registrados
                </TableCell>
              </TableRow>
            ) : (
              duenos.map((dueno) => (
                <TableRow key={dueno.id}>
                  <TableCell className="font-medium">
                    {dueno.nombre}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      {dueno.DNI}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {dueno.correo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {dueno.telefono}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {dueno.direccion}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {dueno.cantidadMascota} mascota{dueno.cantidadMascota !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(dueno)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(dueno)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {selectedDueno && (
        <EditDuenoModal 
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          dueno={selectedDueno}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el dueño{" "}
              <strong>{duenoToDelete?.nombre}</strong> (DNI: {duenoToDelete?.DNI}) del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}