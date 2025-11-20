import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
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
        color: 'hsl(290, 70%, 50%)',
    },
} satisfies ChartConfig;

const COLORS = ['hsl(220, 70%, 50%)', 'hsl(340, 75%, 50%)', 'hsl(290, 70%, 50%)'];

export function PetSpeciesChart({ data }: PetSpeciesChartProps) {
    const chartData = [
        { name: 'perros', value: data.perros, fill: COLORS[0] },
        { name: 'gatos', value: data.gatos, fill: COLORS[1] },
        { name: 'conejos', value: data.conejos, fill: COLORS[2] },
    ].filter(item => item.value > 0);

    const total = data.perros + data.gatos + data.conejos;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Mascotas por Especie</CardTitle>
                <CardDescription className="text-xs">
                    Distribución de mascotas registradas
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[180px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={40}
                            outerRadius={80}
                            strokeWidth={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-1 mt-3">
                    {Object.entries(data).map(([species, count]) => (
                        count > 0 && (
                            <Badge key={species} variant="outline" className="text-xs">
                                {chartConfig[species as keyof typeof chartConfig].label}: {count}
                            </Badge>
                        )
                    ))}
                    <Badge variant="secondary" className="text-xs">Total: {total}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}