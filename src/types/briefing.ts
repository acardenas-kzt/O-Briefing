export interface ClimaDia {
  dia: string;
  max: string;
  min: string;
  probabilidad: string;
  condicion: string;
}

export interface TipoCambio {
  dof: string;
  usd: string;
  cad: string;
  eur: string;
  gbp: string;
}

export interface CensoCierre {
  fecha: string;
  llegadas: string;
  salidas: string;
  habitaciones: string;
  ocupacionPct: string;
}

export interface PrevisionHotel {
  hotel: string;
  llegadas: string;
  salidas: string;
  habOcupadas: string;
}

export interface HuespedesEnCasa {
  adultos: { complejo: string; goc: string; pyr: string };
  menores: { complejo: string; goc: string; pyr: string };
  total: { complejo: string; goc: string; pyr: string };
}

export interface PlaneacionSemanalDia {
  dia: string;
  llegadas: string;
  salidas: string;
  habOcupadas: string;
  totalComplejo: string;
}

export interface VIPSocioItem {
  nombre: string;
  habitacion?: string;
  fecha?: string;
  tipo?: string;
  notas?: string;
}

export interface VisitaInspeccion {
  nombre: string;
  pax: string;
}

export interface HuespedCelebrando {
  nombre: string;
  habitacion: string;
  motivo: string;
}

export interface EventoItem {
  nombre: string;
  lugar: string;
  horario: string;
  pax: string;
}

export interface TarifaHabitacion {
  categoria: string;
  hotel: 'Grand Oasis Cancun' | 'The Pyramid';
  pax1: string;
  pax2: string;
  pax3: string;
}

export interface TarifaEjecutiva {
  tipo: string;
  goc: { pax1: string; pax2: string; pax3: string };
  pyr: { pax1: string; pax2: string; pax3: string };
}

export interface UpgradeItem {
  categoriaOrigenDestino: string;
  seccion: 'Grand Oasis Cancun (GOC-GOC)' | 'The Pyramid';
  precio: string;
}

export interface DayPassItem {
  concepto: string;
  precio: string;
  categoria: string;
}

export interface BeachClubItem {
  concepto: string;
  otlc: string;
  pyrms: string;
  pyr: string;
  grand: string;
}

export interface RestauranteGourmetTarifa {
  restaurante: string;
  piramide: string;
  grandOasis: string;
  otrosOasis: string;
  externos: string;
  vip: string;
  sianKaan: string;
}

export interface CentroConsumo {
  id: string;
  nombre: string;
  tipo: 'restaurante' | 'bar';
  activo: boolean;
  cierres: string;
  horarios: {
    desayuno?: string;
    comida?: string;
    cena?: string;
    general?: string;
  };
  observaciones: string;
}

export interface ServicioGeneral {
  nombre: string;
  horario: string;
  notas?: string;
}

export interface ServicioTarifa {
  concepto: string;
  precio: string;
  notas?: string;
}

export interface SpaPromo {
  nombre: string;
  incluye: string[];
  precio: string;
}

export interface CalificacionComunidad {
  canal: string;
  goc: string;
  pyr: string;
  detallesGoc?: string;
  detallesPyr?: string;
}

export interface CellInspection {
  key: string;
  label: string;
  section: string;
  cellCoordinate?: string;
  sourceRow?: number;
  sourceCol?: number;
  parsedValue: string;
  status: 'FOUND' | 'NC';
  overrideValue?: string;
}

export interface BriefingData {
  id: string;
  fecha: string;
  mandamiento: string;
  avisoBanner: string;
  clima: ClimaDia[];
  tipoCambio: TipoCambio;
  censoCierre: CensoCierre;
  previsionGOC: PrevisionHotel;
  previsionPYR: PrevisionHotel;
  huespedesEnCasa: HuespedesEnCasa;
  planeacionSemanal: PlaneacionSemanalDia[];
  vips: {
    llegando: VIPSocioItem[];
    enCasa: VIPSocioItem[];
    saliendo: VIPSocioItem[];
  };
  sociosOTLC: {
    llegando: VIPSocioItem[];
    enCasa: VIPSocioItem[];
    enCasaCol1?: VIPSocioItem[];
    enCasaCol2?: VIPSocioItem[];
    nuevos: VIPSocioItem[];
    saliendo: VIPSocioItem[];
  };
  visitasInspeccion: VisitaInspeccion[];
  huespedesCelebrando: HuespedCelebrando[];
  eventos: {
    hoy: EventoItem[];
    manana: EventoItem[];
    entretenimiento: { show: string; lugar: string; horario: string }[];
  };
  tarifas: {
    habitaciones: TarifaHabitacion[];
    ejecutiva: TarifaEjecutiva[];
    reglasEjecutiva: string;
    paxExtras: { concepto: string; goc: string; pyr: string }[];
    reglasPaxExtras: string;
    upgrades: UpgradeItem[];
    dayPass: DayPassItem[];
    beachClub: BeachClubItem[];
    restaurantesGourmet: RestauranteGourmetTarifa[];
  };
  beneficios: {
    sociosNuevosOTLC: string[];
    sociosAnterioresOTLC: string[];
    algGOC: string[];
    algPYR: string[];
    pyrms: string[];
    minibarGOC: string;
    minibarPYR: string;
    mercadoAmericano: string[];
    tripulacionCapitanes: string[];
    tripulacionSobrecargos: string[];
  };
  centrosConsumo: CentroConsumo[];
  servicios: {
    generales: ServicioGeneral[];
    tarifas: ServicioTarifa[];
    llamadas: { tipo: string; precio: string }[];
    spaPromos: SpaPromo[];
  };
  comunidadDigital: CalificacionComunidad[];
  interno: {
    mision: string;
    vision: string;
    valores: string[];
    mandamientosCultura: string[];
  };
  cellInspections: CellInspection[];
  rawMatrix?: string[][];
}
