import React, { useState } from 'react';
import { Trash2, Lock, AlertCircle, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StoredBriefingRecord } from '../../utils/briefingStorage';
import {
  isAdminSessionAuthenticated,
  setAdminSessionAuthenticated,
} from '../../utils/adminSession';

interface DeleteBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StoredBriefingRecord | null;
  onConfirmDelete: (recordId: string) => void;
}

const REQUIRED_PASSWORD = 'O-Briefing_2026';

export const DeleteBriefingModal: React.FC<DeleteBriefingModalProps> = ({
  isOpen,
  onClose,
  record,
  onConfirmDelete,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isAlreadyAuthenticated = isAdminSessionAuthenticated();

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyAuthenticated || password === REQUIRED_PASSWORD) {
      if (!isAlreadyAuthenticated) {
        setAdminSessionAuthenticated(true);
      }
      onConfirmDelete(record.id);
      onClose();
    } else {
      setError('Contraseña incorrecta. Solo usuarios autorizados pueden eliminar briefings.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-['Montserrat',sans-serif]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Eliminar Briefing
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                Acción restringida por contraseña
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-rose-100/50 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target File Info */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="truncate">{record.title}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Fecha: <strong className="text-slate-700">{record.dateStr}</strong>
            </p>
            {record.uploaderName && (
              <p className="text-[11px] text-slate-500">
                Registrado por: <strong className="text-slate-700">{record.uploaderName}</strong>
              </p>
            )}
          </div>

          {isAlreadyAuthenticated ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Sesión de administrador activa</span>
                <span className="text-[11px] text-emerald-700">Autorizado para eliminar sin necesidad de reingresar la contraseña.</span>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 leading-relaxed text-[11px]">
                <strong>Atención:</strong> Esta acción borrará el registro de los archivos históricos del hotel. Para confirmar que tienes permisos administrativos, ingresa la clave de autorización.
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Contraseña de Autorización
                </label>
                <input
                  type="password"
                  placeholder="Ingresa la clave autorizada..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 font-mono"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                  </p>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Clave requerida: <strong>O-Briefing_2026</strong></span>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Confirmar Eliminación</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
