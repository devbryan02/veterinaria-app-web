'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useExport } from '../hooks/useExport';
import SelectDueno from '../../mascotas/components/SelectDueno';
import { DuenoProvider } from '../../duenos/context/DuenoContext';

function ExportClient() {
    const [duenoId, setDuenoId] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear());
    const { exportVacunasByDueno, exportAllVacunas, isLoading } = useExport();

    const handleExportByDueno = () => {
        if (duenoId.trim()) {
            exportVacunasByDueno(duenoId.trim());
        }
    };

    const handleExportAll = () => {
        exportAllVacunas(anio);
    };

    const handleAnioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setAnio(value);
        }
    };

    return (
        <DuenoProvider>
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Exportar Reportes</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Exportar por Dueño */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Reporte por Dueño
                            </CardTitle>
                            <CardDescription>
                                Exporta el registro de vacunación de las mascotas de un dueño específico
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="duenoSelect">Seleccionar Dueño</Label>
                                <SelectDueno
                                    value={duenoId}
                                    onValueChange={setDuenoId}
                                    placeholder="Buscar propietario para exportar..."
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                onClick={handleExportByDueno}
                                disabled={!duenoId.trim() || isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Exportando...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Exportar Reporte
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Exportar Todos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Reporte Completo por Año
                            </CardTitle>
                            <CardDescription>
                                Exporta el registro completo de vacunación de todas las mascotas por año
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="anio">Año</Label>
                                <Input
                                    id="anio"
                                    type="number"
                                    value={anio}
                                    onChange={handleAnioChange}
                                    min={2000}
                                    max={new Date().getFullYear() + 5}
                                    disabled={isLoading}
                                    className="w-full"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Selecciona el año del cual quieres exportar los registros de vacunación
                                </p>
                            </div>
                            <Button
                                onClick={handleExportAll}
                                disabled={isLoading}
                                className="w-full"
                                variant="outline"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Exportando...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Exportar {anio}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Información adicional */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información sobre los reportes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Los reportes se exportan en formato Excel (.xlsx)</li>
                            <li>• El archivo se descargará automáticamente al completarse la exportación</li>
                            <li>• Los reportes incluyen información detallada de vacunas, mascotas y dueños</li>
                            <li>• El reporte completo filtra por año las vacunas aplicadas</li>
                            <li>• Usa el selector para buscar por nombre o DNI del propietario</li>
                            <li>• Asegúrate de tener permisos de descarga habilitados en tu navegador</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </DuenoProvider>
    );
}

export default ExportClient;