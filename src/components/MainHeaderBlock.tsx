import React from 'react';
import { BriefingData } from '../types/briefing';
import { TabId } from './NavigationTabs';
import { Calendar, Search, Info, RotateCw } from 'lucide-react';

interface MainHeaderBlockProps {
  data: BriefingData;
  activeTab?: TabId;
  onOpenHistory?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenSearch?: () => void;
  currentMonthStr?: string;
}

export const MainHeaderBlock: React.FC<MainHeaderBlockProps> = ({
  data,
  activeTab = 'resumen',
  onOpenHistory,
  onRefresh,
  isRefreshing = false,
  onOpenSearch,
  currentMonthStr,
}) => {
  const getSectionHeader = (tab: TabId) => {
    switch (tab) {
      case 'censo':
        return {
          title: 'Censo y Ocupación',
          subtitle: 'Auditoría de cierre, previsiones semanales, socios OTLC y huéspedes VIP',
        };
      case 'eventos':
        return {
          title: 'Eventos y Entretenimiento',
          subtitle: 'Actividades del día, programación de mañana y cartelera de espectáculos',
        };
      case 'tarifas':
        return {
          title: 'Tarifas y Paquetes',
          subtitle: 'Day pass, pases nocturnos y costos de servicios especiales',
        };
      case 'beneficios':
        return {
          title: 'Beneficios Exclusivos',
          subtitle: 'Categorías The Pyramid, Oasis Plus y amenidades exclusivas para socios',
        };
      case 'consumo':
        return {
          title: 'Centros de Consumo',
          subtitle: 'Restaurantes, bares, cafeterías, horarios y códigos de vestir',
        };
      case 'servicios':
        return {
          title: 'Servicios e Instalaciones',
          subtitle: 'Smart cars, spas, pistas deportivas y directorio de atención al huésped',
        };
      case 'interno':
        return {
          title: 'Identidad y Cultura Interna',
          subtitle: 'Misión, visión, valores corporativos y mandamientos de servicio',
        };
      case 'inspector':
        return {
          title: 'Inspector Parsel de Celdas',
          subtitle: 'Auditoría técnica de fórmulas, celdas y validación de datos del archivo',
        };
      case 'resumen':
      default:
        return {
          title: 'O-Briefing',
          subtitle:
            data.mandamiento !== 'N/C'
              ? data.mandamiento
              : 'Mandamiento N°2: "Promover la cultura del detalle con calidad"',
        };
    }
  };

  const sectionHeader = getSectionHeader(activeTab);

  return (
    <div className="space-y-4 mb-6">
      {/* Top Row: Date Pill & Actions with unified height (30px) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 h-[30px] text-[17px]">
        <div className="h-[30px] inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 bg-[#f8fafc] border border-slate-200 px-3 rounded-md box-border">
          <Calendar className="w-3.5 h-3.5 text-[#0369a1]" />
          <span>{data.fecha !== 'N/C' ? data.fecha : 'Viernes 28 de agosto del 2026'}</span>
        </div>

        {/* Action Buttons: Month, Actualizar (icon only), and Search with unified height (30px) - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 h-[30px]">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="hidden sm:flex h-[30px] items-center justify-center gap-1.5 px-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer box-border"
              title="Historial de meses cargados"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0369a1]" />
              <span className="font-mono text-[11px]">{currentMonthStr || 'Agosto 2026'}</span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`hidden sm:flex w-[30px] h-[30px] items-center justify-center rounded-md border text-xs transition-all cursor-pointer box-border ${
                isRefreshing
                  ? 'bg-sky-50 border-sky-300 text-[#0369a1]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
              }`}
              title="Actualizar y recargar datos de la hoja de cálculo activa"
              aria-label="Actualizar datos"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#0369a1] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex w-[151px] h-[30px] items-center justify-between gap-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-mono cursor-pointer box-border"
              title="Buscar (⌘K)"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Search className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="text-slate-500 font-sans text-xs">Buscar...</span>
              </span>
              <kbd className="text-[10px] bg-slate-200/80 px-1 py-0.5 rounded border border-slate-300 font-mono flex-shrink-0">⌘K</kbd>
            </button>
          )}
        </div>
      </div>

      <div className="title-block">
        <h1 className="text-[50px] leading-[60px] font-black tracking-tight text-slate-900 font-['Montserrat',sans-serif] bg-gradient-to-r from-[#0f172a] via-[#0f172a] to-[#0369a1] bg-clip-text text-transparent">
          {sectionHeader.title}
        </h1>
        {activeTab === 'resumen' && (
          <p className="mt-2 font-semibold text-[20px] text-slate-500">
            {sectionHeader.subtitle}
          </p>
        )}
      </div>

      {/* Línea divisora para dar respiro al título en todas las secciones excepto Resumen */}
      {activeTab !== 'resumen' && (
        <hr className="border-0 border-t border-slate-200 mt-4 mb-[40px]" />
      )}

      {/* Sian Ka'an Notice as Announcement Bar + Divider Line - only on resumen */}
      {activeTab === 'resumen' && data.avisoBanner && data.avisoBanner !== 'N/C' && (
        <>
          <p className="flex items-center gap-2.5 px-3.5 rounded-lg bg-sky-50/90 border border-sky-200/90 font-semibold text-[#0369a1] tracking-wide shadow-2xs text-[10px] mb-0 h-[25px]">
            <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-sky-100 text-[#0369a1]">
              <Info className="h-[15px] w-[15px]" />
            </span>
            <span className="flex-1 truncate">{data.avisoBanner}</span>
          </p>
          <hr className="border-0 border-t border-slate-200 pb-0 mt-[20px] mb-[20px]" />
        </>
      )}

      {/* Editorial Metrics Grid - only on resumen and censo */}
      {(activeTab === 'resumen' || activeTab === 'censo') && (
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-[#0f172a] rounded-md overflow-hidden bg-white shadow-xs h-[95px]">
          <div className="h-full py-2 px-4 sm:px-5 flex flex-col justify-center border-r border-b md:border-b-0 border-[#0f172a]">
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 font-['Montserrat',sans-serif]">
              {data.censoCierre.ocupacionPct !== 'N/C' ? data.censoCierre.ocupacionPct : '73.1%'}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 block mt-0.5">
              Ocupación Cierre
            </span>
          </div>

          <div className="h-full py-2 px-4 sm:px-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#0f172a]">
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 font-['Montserrat',sans-serif]">
              {data.huespedesEnCasa.total.complejo !== 'N/C' ? data.huespedesEnCasa.total.complejo : '1,742'}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 block mt-0.5">
              Huéspedes en Casa
            </span>
          </div>

          <div className="h-full py-2 px-4 sm:px-5 flex flex-col justify-center border-r border-[#0f172a]">
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 font-['Montserrat',sans-serif]">
              {data.censoCierre.llegadas !== 'N/C' ? data.censoCierre.llegadas : '118'}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 block mt-0.5">
              Llegadas Hoy
            </span>
          </div>

          <div className="h-full py-2 px-4 sm:px-5 flex flex-col justify-center">
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 font-['Montserrat',sans-serif]">
              {data.censoCierre.salidas !== 'N/C' ? data.censoCierre.salidas : '119'}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 block mt-0.5">
              Salidas Hoy
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
