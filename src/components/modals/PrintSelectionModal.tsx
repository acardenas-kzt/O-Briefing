import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  CheckSquare,
  Square,
  FileText,
  Users,
  CalendarDays,
  Receipt,
  Gift,
  UtensilsCrossed,
  Briefcase,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { TabId } from '../NavigationTabs';

export interface SectionPrintOption {
  id: TabId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

export const PRINTABLE_SECTIONS: SectionPrintOption[] = [
  {
    id: 'resumen',
    label: 'Resumen Ejecutivo',
    description: 'Auditoría de cierre, clima, ocupación general y tipo de cambio',
    icon: FileText,
    tag: 'Dirección',
  },
  {
    id: 'censo',
    label: 'Censo y Ocupación',
    description: 'Previsiones semanales, socios OTLC, VIPs, visitas y celebraciones',
    icon: Users,
    tag: 'Operaciones',
  },
  {
    id: 'eventos',
    label: 'Eventos y Entretenimiento',
    description: 'Actividades de hoy y mañana, cartelera de shows en vivo',
    icon: CalendarDays,
    tag: 'Animación',
  },
  {
    id: 'tarifas',
    label: 'Tarifas y Paquetes',
    description: 'Day pass, pases nocturnos y costos de servicios especiales',
    icon: Receipt,
    tag: 'Comercial',
  },
  {
    id: 'beneficios',
    label: 'Beneficios Exclusivos',
    description: 'Categorías The Pyramid, Oasis Plus y beneficios de socios',
    icon: Gift,
    tag: 'Socios',
  },
  {
    id: 'consumo',
    label: 'Centros de Consumo',
    description: 'Restaurantes de especialidad, bares, cafeterías y códigos de vestir',
    icon: UtensilsCrossed,
    tag: 'A&B',
  },
  {
    id: 'servicios',
    label: 'Servicios e Instalaciones',
    description: 'Smart cars, spas, pistas deportivas y directorio telefónico',
    icon: Briefcase,
    tag: 'Servicios',
  },
  {
    id: 'interno',
    label: 'Identidad y Cultura Interna',
    description: 'Misión, visión, valores corporativos y mandamientos de servicio',
    icon: ShieldCheck,
    tag: 'RRHH',
  },
];

interface PrintSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrint: (selectedSections: TabId[], pageBreakBetween: boolean) => void;
  defaultSections?: TabId[];
}

export const PrintSelectionModal: React.FC<PrintSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirmPrint,
  defaultSections = ['resumen', 'censo', 'eventos', 'tarifas', 'beneficios', 'consumo', 'servicios', 'interno'],
}) => {
  const [selectedSections, setSelectedSections] = useState<TabId[]>(defaultSections);
  const [pageBreakBetween, setPageBreakBetween] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (selectedSections.length === 0) {
        setSelectedSections(defaultSections);
      }
    }
  }, [isOpen, defaultSections]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleSection = (id: TabId) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedSections(PRINTABLE_SECTIONS.map((s) => s.id));
  };

  const handleSelectNone = () => {
    setSelectedSections([]);
  };

  const handleApplyPreset = (preset: 'all' | 'resumen' | 'operacion' | 'comercial') => {
    switch (preset) {
      case 'all':
        setSelectedSections(PRINTABLE_SECTIONS.map((s) => s.id));
        break;
      case 'resumen':
        setSelectedSections(['resumen']);
        break;
      case 'operacion':
        setSelectedSections(['resumen', 'censo', 'eventos']);
        break;
      case 'comercial':
        setSelectedSections(['tarifas', 'beneficios', 'consumo']);
        break;
    }
  };

  const handlePrintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSections.length === 0) return;
    onConfirmPrint(selectedSections, pageBreakBetween);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#f8fafc] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0369a1] flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-['Montserrat',sans-serif]">
                Imprimir Informe O-Briefing
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona las secciones que deseas incluir en el documento impreso o exportación a PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets and Quick Select Toolbar */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Preajustes:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('all')}
              className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Completo (8)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('resumen')}
              className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Solo Resumen
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('operacion')}
              className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Operativo (3)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('comercial')}
              className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Comercial & A&B
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[#0369a1] hover:underline font-semibold cursor-pointer text-xs"
            >
              Marcar todas
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleSelectNone}
              className="text-slate-500 hover:underline font-medium cursor-pointer text-xs"
            >
              Desmarcar
            </button>
          </div>
        </div>

        {/* Scrollable Section Selection Grid */}
        <form onSubmit={handlePrintSubmit} className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRINTABLE_SECTIONS.map((section) => {
              const isChecked = selectedSections.includes(section.id);
              const Icon = section.icon;

              return (
                <div
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                    isChecked
                      ? 'border-[#0369a1] bg-sky-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50/70 opacity-80'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <div className="w-5 h-5 rounded-md bg-[#0369a1] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm font-['Montserrat',sans-serif] flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-[#0369a1]' : 'text-slate-400'}`} />
                        {section.label}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
                        {section.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {section.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page break option */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={pageBreakBetween}
                onChange={(e) => setPageBreakBetween(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0369a1] focus:ring-[#0369a1]"
              />
              <span className="font-semibold">Insertar salto de página entre cada sección al imprimir</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Formato A4 / Carta</span>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-900">{selectedSections.length}</span> de {PRINTABLE_SECTIONS.length} secciones seleccionadas
            {selectedSections.length === 0 && (
              <span className="text-rose-600 block text-[11px] font-semibold mt-0.5">
                Debes seleccionar al menos una sección para imprimir.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={selectedSections.length === 0}
              onClick={handlePrintSubmit}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                selectedSections.length > 0
                  ? 'bg-[#0f172a] hover:bg-slate-800 text-white active:scale-98'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
