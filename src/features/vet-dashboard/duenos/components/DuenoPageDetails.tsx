'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDuenoContext } from '../context/DuenoContext';
import { DuenoFullDetails } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, User, PawPrint, MapPin, Gauge } from 'lucide-react';
import DuenoPageDetailsSkeleton from './DuenoPageDetailsSkeleton';
import DuenoLocationMap from './DuenoLocationMap';

function DuenoPageDetails() {
    const router = useRouter();
    const { id } = useParams();
    const { getDuenoDetails, loading } = useDuenoContext();
    const [duenoDetails, setDuenoDetails] = useState<DuenoFullDetails | null>(null);

    useEffect(() => {
        if (id && typeof id === 'string') {
            const loadDuenoDetails = async () => {
                const details = await getDuenoDetails(id);
                setDuenoDetails(details);
            };
            loadDuenoDetails();
        }
    }, [id, getDuenoDetails]);

    if (loading) {
        return <DuenoPageDetailsSkeleton />;
    }

    if (!duenoDetails) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-48">
                        <User className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No se encontraron datos del dueño</p>
                        <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                            className="mt-4"
                        >
                            Volver
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { 
        nombre, 
        dni, 
        direccion, 
        telefono, 
        correo, 
        longitud, 
        latitud,
        mascota
    } = duenoDetails;

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            {/* Header con botón de regreso */}
            <div className="flex items-center gap-4 mb-6">
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{nombre}</h1>
                    <p className="text-muted-foreground">DNI: {dni}</p>
                </div>
                <div className="ml-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PawPrint className="w-4 h-4" />
                        <span>{mascota.cantidadMascotas} mascota{mascota.cantidadMascotas !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Columna principal - Información del dueño */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card principal con información básica */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Información Personal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                                    <p className="font-medium">{nombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">DNI</p>
                                    <p className="font-mono text-sm font-medium">{dni}</p>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>{direccion}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                                        <p className="font-medium">{telefono}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p className="font-medium">{correo}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mapa de ubicación */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="w-4 h-4" />
                                Ubicación en el Mapa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DuenoLocationMap
                                latitud={latitud}
                                longitud={longitud}
                                nombre={nombre}
                                direccion={direccion}
                                className="h-[400px]"
                            />
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Latitud</p>
                                    <p className="font-mono text-sm">{latitud}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Longitud</p>
                                    <p className="font-mono text-sm">{longitud}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Mascotas */}
                <div className="space-y-6">
                    {/* Lista de mascotas */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <PawPrint className="w-4 h-4" />
                                Mascotas ({mascota.cantidadMascotas})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mascota.mascotasList.length > 0 ? (
                                <div className="space-y-3">
                                    {mascota.mascotasList.map((pet) => (
                                        <div key={pet.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarFallback className="text-xs">
                                                        <PawPrint className="w-4 h-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{pet.nombre}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {pet.especie} • {pet.raza}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {pet.sexo}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <PawPrint className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Sin mascotas registradas</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estadísticas */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Gauge className="w-4 h-4" />
                                Resumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total de mascotas</span>
                                    <span className="font-medium">{mascota.cantidadMascotas}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Perros</span>
                                    <span className="font-medium">
                                        {mascota.mascotasList.filter(pet => pet.especie.toLowerCase() === 'perro').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Gatos</span>
                                    <span className="font-medium">
                                        {mascota.mascotasList.filter(pet => pet.especie.toLowerCase() === 'gato').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Otros</span>
                                    <span className="font-medium">
                                        {mascota.mascotasList.filter(pet => 
                                            !['perro', 'gato'].includes(pet.especie.toLowerCase())
                                        ).length}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DuenoPageDetails;