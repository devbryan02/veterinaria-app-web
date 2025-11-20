export interface EstadisticasDashboard {
  totalDuenos: number;
  totalMascotas: number;
  totalVacunas: number;
  mascotasPorEspecie: {
    perros: number;
    gatos: number;
    conejos: number;
  };
  vacunasPorMes: VacunaPorMes[];
  mascotasRegistradasPorAnio: MascotaPorAnio[];
}

export interface VacunaPorMes {
  mes: string;
  total: number;
}

export interface MascotaPorAnio {
  anio: number;
  total: number;
}


export type Mes = 
  | 'JANUARY' 
  | 'FEBRUARY' 
  | 'MARCH' 
  | 'APRIL' 
  | 'MAY' 
  | 'JUNE' 
  | 'JULY' 
  | 'AUGUST' 
  | 'SEPTEMBER' 
  | 'OCTOBER' 
  | 'NOVEMBER' 
  | 'DECEMBER';

export interface VacunaPorMesEspecifico {
  mes: Mes;
  total: number;
}