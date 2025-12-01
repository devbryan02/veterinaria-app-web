import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { VacunaPorMes } from '../types/Index';

interface VaccinesPerMonthChartProps {
    data: VacunaPorMes[];
}

const chartConfig = {
    total: {
        label: 'Vacunas',
        color: 'hsl(142, 76%, 36%)',
    },
} satisfies ChartConfig;

const monthsInSpanish = {
    JANUARY: 'Ene', FEBRUARY: 'Feb', MARCH: 'Mar', APRIL: 'Abr',
    MAY: 'May', JUNE: 'Jun', JULY: 'Jul', AUGUST: 'Ago',
    SEPTEMBER: 'Sep', OCTOBER: 'Oct', NOVEMBER: 'Nov', DECEMBER: 'Dic',
};

export function VaccinesPerMonthChart({ data }: VaccinesPerMonthChartProps) {
    const monthOrder = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    const sortedData = data
        .sort((a, b) => monthOrder.indexOf(a.mes) - monthOrder.indexOf(b.mes))
        .map(item => ({
            ...item,
            mesCorto: monthsInSpanish[item.mes as keyof typeof monthsInSpanish] || item.mes,
        }));

    const totalVacunas = data.reduce((sum, item) => sum + item.total, 0);
    const mesConMasVacunas = data.reduce((prev, current) => 
        prev.total > current.total ? prev : current
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Vacunas por Mes</CardTitle>
                <CardDescription className="text-xs">
                    Distribución mensual de vacunas aplicadas
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="min-h-40">
                    <BarChart data={sortedData}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <XAxis 
                            dataKey="mesCorto"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            fontSize={10}
                        />
                        <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tickMargin={6}
                            fontSize={10}
                        />
                        <Bar 
                            dataKey="total" 
                            fill="hsl(142, 76%, 36%)"
                            radius={3}
                        />
                    </BarChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-1 mt-3">
                    <Badge variant="secondary" className="text-xs">
                        Total: {totalVacunas}
                    </Badge>
                    {totalVacunas > 0 && (
                        <Badge variant="outline" className="text-xs">
                            Pico: {monthsInSpanish[mesConMasVacunas.mes as keyof typeof monthsInSpanish]} ({mesConMasVacunas.total})
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}