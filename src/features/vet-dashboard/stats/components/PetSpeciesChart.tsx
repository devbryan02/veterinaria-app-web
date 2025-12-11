"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface PetSpeciesChartProps {
    data: {
        perros: number;
        gatos: number;
        conejos: number;
    };
}

const chartConfig = {
    perros: {
        label: 'Perros',
        color: 'hsl(220, 70%, 50%)',
    },
    gatos: {
        label: 'Gatos',
        color: 'hsl(340, 75%, 50%)',
    },
    conejos: {
        label: 'Conejos',
        color: 'hsl(142, 70%, 45%)',
    },
} satisfies ChartConfig;

export function PetSpeciesChart({ data }: PetSpeciesChartProps) {
    const chartData = [
        { name: 'Perros', value: data.perros, fill: chartConfig.perros.color },
        { name: 'Gatos', value: data.gatos, fill: chartConfig.gatos.color },
        { name: 'Conejos', value: data.conejos, fill: chartConfig.conejos.color },
    ].filter(item => item.value > 0); // Solo mostrar especies con datos

    const total = data.perros + data.gatos + data.conejos;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-lg">Mascotas por Especie</CardTitle>
                <CardDescription className="text-xs">
                    Distribución de mascotas registradas
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer 
                    config={chartConfig} 
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}  // Hace un donut chart
                            outerRadius={80}
                            paddingAngle={5}
                            label={({ name, percent }) => 
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                        />
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-1 mt-4 justify-center">
                    {Object.entries(data).map(([species, count]) => (
                        count > 0 && (
                            <Badge key={species} variant="outline" className="text-xs">
                                {chartConfig[species as keyof typeof chartConfig].label}: {count}
                            </Badge>
                        )
                    ))}
                    <Badge variant="secondary" className="text-xs font-semibold">
                        Total: {total}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}