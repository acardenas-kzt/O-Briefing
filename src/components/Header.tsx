import React from 'react';
import { Search, Calendar, UploadCloud, Printer, FileSpreadsheet, Lock } from 'lucide-react';

interface HeaderProps {
  currentDateStr: string;
  currentMonthStr: string;
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onOpenUpload: () => void;
  onOpenInspector: () => void;
  ncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateStr,
  currentMonthStr,
  onOpenSearch,
  onOpenHistory,
  onOpenUpload,
  onOpenInspector,
  ncCount,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 shadow-2xs">
            <img
              src="/assets/aistudio/LogoOasis_90641185.svg"
              alt="Logo Oasis Hotels & Resorts"
              className="w-full h-full object-contain filter hover:brightness-95 transition-all"
            />
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-['Google_Sans',sans-serif] whitespace-nowrap">
                O-Briefing
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1967d2] border border-[#d2e3fc]">
                Grand Oasis Cancún & The Pyramid
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden lg:block">
              Tablero Ejecutivo Diario de Operaciones y Hospitalidad
            </p>
          </div>
        </div>

        {/* Right Action Bar (Google-like clean actions) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Buscar en el briefing (Ctrl+K)"
            aria-label="Buscar secciones o datos"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Buscar</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
              ⌘K
            </kbd>
          </button>

          {/* Month & Date Archive Selector */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Ver archivos por mes y día"
            aria-label="Ver historial por mes"
          >
            <Calendar className="w-4 h-4 text-[#1a73e8]" />
            <span className="font-semibold text-slate-800">{currentMonthStr}</span>
            <span className="hidden lg:inline text-slate-400">|</span>
            <span className="hidden lg:inline text-slate-600 truncate max-w-[130px]">{currentDateStr}</span>
          </button>

          {/* Parsel / Cell Inspector Button */}
          <button
            onClick={onOpenInspector}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              ncCount > 0
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Inspector de Celdas y Mapeos del Parsel"
            aria-label="Inspector de Celdas"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Celdas</span>
            {ncCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                {ncCount} N/C
              </span>
            )}
          </button>

          {/* Password protected Upload / Google Sheet Link button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#f0f6ff] hover:bg-[#e8f0fe] border border-[#d2e3fc] rounded-lg transition-colors"
            title="Subir archivo Excel o actualizar enlace de Google Sheets"
            aria-label="Subir o cambiar enlace"
          >
            <Lock className="w-3.5 h-3.5 text-[#1a73e8]" />
            <UploadCloud className="w-4 h-4 text-[#1a73e8]" />
            <span className="hidden sm:inline font-semibold">Cargar Hoja</span>
          </button>

          {/* Print to PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-98"
            title="Imprimir o Guardar como PDF"
            aria-label="Imprimir en PDF"
          >
            <Printer className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Imprimir PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
