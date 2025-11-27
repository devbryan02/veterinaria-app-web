'use client';

import { useStats } from '../hooks/useStats';
import { StatsOverview } from './StatsOverview';
import { PetSpeciesChart } from './PetSpeciesChart';
import { VaccinesPerMonthChart } from './VaccinesPerMothChart';
import { PetsRegistrationChart } from './PetsRegistrationChart';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function StatsClient() {
    const { data: stats, isLoading, error, refetch } = useStats();

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Error al cargar las estadísticas: {error.message}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard de Estadísticas</h1>
                <Button 
                    onClick={refetch} 
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {isLoading && !stats ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            ) : (
                stats && (
                    <>
                        <StatsOverview stats={stats} />
                        <div className="grid gap-6 md:grid-cols-2">
                            <PetSpeciesChart data={stats.mascotasPorEspecie} />
                            <VaccinesPerMonthChart data={stats.vacunasPorMes} />
                        </div>
                        <PetsRegistrationChart data={stats.mascotasRegistradasPorAnio} />
                    </>
                )
            )}
        </div>
    );
}

export default StatsClient;