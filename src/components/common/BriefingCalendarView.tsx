import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  Calendar as CalendarIcon,
  Download,
  User,
  ArrowRight,
  Eye,
  Trash2,
} from 'lucide-react';
import { StoredBriefingRecord } from '../../utils/briefingStorage';
import { DeleteBriefingModal } from '../modals/DeleteBriefingModal';

interface BriefingCalendarViewProps {
  records: StoredBriefingRecord[];
  activeId: string;
  onSelectRecord: (record: StoredBriefingRecord) => void;
  onDeleteRecord?: (recordId: string) => void;
  onClose?: () => void;
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const BriefingCalendarView: React.FC<BriefingCalendarViewProps> = ({
  records,
  activeId,
  onSelectRecord,
  onDeleteRecord,
  onClose,
}) => {
  const [recordToDelete, setRecordToDelete] = useState<StoredBriefingRecord | null>(null);
  // Find active record date or default to latest record
  const currentActiveRecord = records.find((r) => r.id === activeId) || records[0];
  const initialDate = currentActiveRecord ? new Date(currentActiveRecord.timestamp) : new Date(2026, 7, 28);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() || 7); // 0-indexed (7 = Agosto)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(() => {
    if (currentActiveRecord) {
      const d = new Date(currentActiveRecord.timestamp);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    return '2026-08-28';
  });

  // Map records by YYYY-MM-DD
  const recordsByDateKey = React.useMemo(() => {
    const map = new Map<string, StoredBriefingRecord[]>();
    records.forEach((rec) => {
      const d = new Date(rec.timestamp);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const list = map.get(key) || [];
        list.push(rec);
        map.set(key, list);
      }
    });
    return map;
  }, [records]);

  // Calendar computation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday = 0, Sunday = 6
  const startOffset = (firstDayOfWeek + 6) % 7;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDownloadCsv = (record: StoredBriefingRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([record.csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${record.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedRecords = selectedDateKey ? recordsByDateKey.get(selectedDateKey) || [] : [];

  return (
    <div className="flex flex-col gap-4 font-['Montserrat',sans-serif]">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#0369a1]" />
          <h4 className="font-extrabold text-slate-800 text-sm">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h4>
          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {records.length} archivos
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(7);
              setSelectedDateKey('2026-08-28');
            }}
            className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg cursor-pointer"
          >
            Hoy (Ago 2026)
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] uppercase tracking-wider text-slate-400">
        {WEEKDAY_NAMES.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Leading empty offsets */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div
            key={`offset-${i}`}
            className="min-h-[52px] rounded-xl bg-slate-50/40 border border-transparent"
          />
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const dayRecords = recordsByDateKey.get(dateKey) || [];
          const hasRecord = dayRecords.length > 0;
          const isSelected = selectedDateKey === dateKey;
          const isDayActive = dayRecords.some((r) => r.id === activeId);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedDateKey(dateKey)}
              className={`min-h-[52px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                isSelected
                  ? 'ring-2 ring-[#0369a1] bg-sky-50/70 border-[#0369a1]'
                  : hasRecord
                  ? isDayActive
                    ? 'bg-sky-50/50 border-[#0369a1]/40 hover:border-[#0369a1]'
                    : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold font-mono ${
                    isSelected
                      ? 'text-[#0369a1] font-black'
                      : hasRecord
                      ? 'text-slate-900 font-extrabold'
                      : 'text-slate-400'
                  }`}
                >
                  {dayNum}
                </span>

                {isDayActive && (
                  <span
                    className="w-2 h-2 rounded-full bg-[#0369a1]"
                    title="Briefing activo actualmente"
                  />
                )}
              </div>

              {hasRecord ? (
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase font-mono truncate block max-w-full ${
                      isDayActive
                        ? 'bg-[#0369a1] text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isDayActive ? 'Activo' : `${dayRecords.length} doc`}
                  </span>
                </div>
              ) : (
                <div className="h-3" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Panel */}
      <div className="mt-2 p-3.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
        {selectedRecords.length > 0 ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#0369a1]" />
                <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  Documentos del {selectedDateKey}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {selectedRecords.length} archivo(s) registrado(s)
              </span>
            </div>

            <div className="space-y-2">
              {selectedRecords.map((rec) => {
                const isActive = rec.id === activeId;
                return (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-white border-[#0369a1] shadow-2xs ring-1 ring-[#0369a1]/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {rec.title}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0369a1] text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> En Vista
                          </span>
                        )}
                        {rec.isToday && !isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Hoy
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                        <span>{rec.dateStr}</span>
                        {rec.uploaderName && (
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <User className="w-3 h-3 text-[#0369a1]" />
                            Subido por: <strong>{rec.uploaderName}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleDownloadCsv(rec, e)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Descargar copia CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectRecord(rec);
                          if (onClose) onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-100 text-slate-700 cursor-default'
                            : 'bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-2xs'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isActive ? 'En Pantalla' : 'Cargar Briefing'}</span>
                        {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>

                      {onDeleteRecord && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecordToDelete(rec);
                          }}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Eliminar este briefing (requiere contraseña)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-400">
            <p className="font-medium text-slate-600">
              No hay archivo registrado para el {selectedDateKey || 'día seleccionado'}.
            </p>
            <p className="text-[11px] mt-0.5">
              Haz clic en los días con marca verde o azul para explorar los briefings archivados.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal with Password Gate */}
      <DeleteBriefingModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        record={recordToDelete}
        onConfirmDelete={(id) => {
          if (onDeleteRecord) {
            onDeleteRecord(id);
          }
        }}
      />
    </div>
  );
};
