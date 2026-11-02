import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, KeyRound } from 'lucide-react';

import {
  setAuditoriaSessionAuthenticated,
  isAuditoriaSessionAuthenticated,
} from '../../utils/adminSession';

interface AuditoriaPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ncCount: number;
}

const AUDITORIA_PASSWORD = 'Persel_2026';

export const AuditoriaPasswordModal: React.FC<AuditoriaPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ncCount,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isAuditoriaSessionAuthenticated()) {
        onSuccess();
        onClose();
        return;
      }
      setPassword('');
      setError('');
    }
  }, [isOpen, onSuccess, onClose]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === AUDITORIA_PASSWORD) {
      setAuditoriaSessionAuthenticated(true);
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Contraseña incorrecta. Acceso restringido únicamente a personal de auditoría.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0369a1] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-['Montserrat',sans-serif]">
                Auditoría Parsel ({ncCount} N/C)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Verificación de celdas y validación técnica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Acceso Restringido</span>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                Para inspeccionar y modificar los valores de fórmulas y parcelas del briefing diario, ingrese la clave de auditoría.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Contraseña de Auditoría</span>
            </label>
            <input
              type="password"
              placeholder="Ingrese Persel_2026..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30 focus:border-[#0369a1] font-mono"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

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
              className="px-5 py-2 text-xs font-extrabold text-white bg-[#0369a1] hover:bg-[#0284c7] rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              Ingresar a Auditoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
