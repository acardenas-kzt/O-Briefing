import React from 'react';
import { Calendar, X, PlusCircle } from 'lucide-react';
import { StoredBriefingRecord } from '../../utils/briefingStorage';
import { BriefingCalendarView } from '../common/BriefingCalendarView';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: StoredBriefingRecord[];
  activeId: string;
  onSelectRecord: (record: StoredBriefingRecord) => void;
  onDeleteRecord?: (recordId: string) => void;
  onOpenUpload: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  activeId,
  onSelectRecord,
  onDeleteRecord,
  onOpenUpload,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0369a1] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0369a1]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Montserrat',sans-serif]">
                Calendario de Archivos O-Briefing
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona cualquier fecha en el calendario para consultar o cargar el briefing histórico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Interactive Calendar View */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <BriefingCalendarView
            records={records}
            activeId={activeId}
            onSelectRecord={onSelectRecord}
            onDeleteRecord={onDeleteRecord}
            onClose={onClose}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {records.length} archivos disponibles en el historial
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenUpload();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-white bg-[#0369a1] hover:bg-[#0284c7] rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Subir Nueva Hoja</span>
          </button>
        </div>
      </div>
    </div>
  );
};
