import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Shield, PawPrint, TrendingUp } from 'lucide-react';
import { EstadisticasDashboard } from '../types/Index';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
    stats: EstadisticasDashboard;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    const cards = [
        {
            title: 'Total Dueños',
            value: stats.totalDuenos,
            icon: Users,
            badgeText: 'Registrados',
            description: 'Usuarios activos'
        },
        {
            title: 'Total Mascotas',
            value: stats.totalMascotas,
            icon: PawPrint,
            badgeText: 'Registradas',
            description: 'Mascotas en el sistema'
        },
        {
            title: 'Total Vacunas',
            value: stats.totalVacunas,
            icon: Shield,
            badgeText: 'Aplicadas',
            description: 'Vacunas administradas'
        },
        {
            title: 'Especies',
            value: Object.keys(stats.mascotasPorEspecie).filter(
                key => stats.mascotasPorEspecie[key as keyof typeof stats.mascotasPorEspecie] > 0
            ).length,
            icon: Heart,
            badgeText: 'Tipos',
            description: 'Especies diferentes'
        },
    ];

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card 
                    key={index} 
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                                    {card.title}
                                </CardTitle>
                                <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <card.icon className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="text-3xl font-bold tracking-tight">
                                    {card.value.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-4">
                        <Badge variant="secondary" className="text-xs font-medium">
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            {card.badgeText}
                        </Badge>
                        
                        {/* Progress indicator */}
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${Math.min(90, (card.value / Math.max(...cards.map(c => c.value))) * 100)}%` 
                                }}
                            />
                        </div>
                    </CardContent>
                    
                    {/* Subtle hover indicator */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Card>
            ))}
        </div>
    );
}