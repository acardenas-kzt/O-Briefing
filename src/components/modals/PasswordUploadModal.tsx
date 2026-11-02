import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Upload,
  Link,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
  User,
  AlertTriangle,
} from 'lucide-react';
import { parseExcelFile, fetchGoogleSheetCSV } from '../../utils/excelParser';
import { parseBriefingData } from '../../utils/briefingParser';
import { BriefingData } from '../../types/briefing';
import { saveStoredRecord, StoredBriefingRecord } from '../../utils/briefingStorage';
import { BriefingCalendarView } from '../common/BriefingCalendarView';

import {
  isAdminSessionAuthenticated,
  setAdminSessionAuthenticated,
  subscribeAdminSession,
} from '../../utils/adminSession';

interface PasswordUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBriefingLoaded: (newData: BriefingData, record: StoredBriefingRecord) => void;
  records?: StoredBriefingRecord[];
  activeId?: string;
  onSelectRecord?: (record: StoredBriefingRecord) => void;
  onDeleteRecord?: (recordId: string) => void;
}

const REQUIRED_PASSWORD = 'O-Briefing_2026';

export const PasswordUploadModal: React.FC<PasswordUploadModalProps> = ({
  isOpen,
  onClose,
  onBriefingLoaded,
  records = [],
  activeId = '',
  onSelectRecord,
  onDeleteRecord,
}) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => isAdminSessionAuthenticated());
  const [authError, setAuthError] = useState('');

  // Primary view mode: 'upload' vs 'calendar'
  const [modalMode, setModalMode] = useState<'upload' | 'calendar'>('upload');

  // Sub-tabs for upload mode
  const [activeTab, setActiveTab] = useState<'upload' | 'google' | 'paste'>('upload');

  // Mandatory uploader name
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderNameError, setUploaderNameError] = useState('');

  // Upload state
  const [sheetUrl, setSheetUrl] = useState('');
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Month & Day assignment
  const [briefingDate, setBriefingDate] = useState('2026-08-28');
  const [briefingMonth, setBriefingMonth] = useState('Agosto 2026');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      if (isAdminSessionAuthenticated()) {
        setIsUnlocked(true);
      }
      setPassword('');
      setAuthError('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    return subscribeAdminSession(() => {
      setIsUnlocked(isAdminSessionAuthenticated());
    });
  }, []);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setAdminSessionAuthenticated(true);
      setIsUnlocked(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. Debe ser: O-Briefing_2026');
    }
  };

  const validateUploaderName = (): boolean => {
    if (!uploaderName.trim()) {
      setUploaderNameError('Es obligatorio ingresar el nombre de la persona que sube el archivo.');
      return false;
    }
    setUploaderNameError('');
    return true;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validateUploaderName()) {
      e.target.value = '';
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const filename = file.name;
      const isCsv = filename.endsWith('.csv') || filename.endsWith('.txt');

      if (isCsv) {
        const text = await file.text();
        const parsed = parseBriefingData(text, file.name);
        const record: StoredBriefingRecord = {
          id: `briefing_${Date.now()}`,
          title: parsed.fecha !== 'N/C' ? parsed.fecha : filename,
          dateStr: parsed.fecha !== 'N/C' ? parsed.fecha : briefingDate,
          monthStr: briefingMonth,
          isToday: true,
          timestamp: Date.now(),
          csvContent: text,
          uploaderName: uploaderName.trim(),
        };
        saveStoredRecord(record);
        onBriefingLoaded(parsed, record);
        setStatusMessage({ text: `¡Archivo CSV cargado exitosamente por ${uploaderName.trim()}!`, type: 'success' });
      } else {
        const buffer = await file.arrayBuffer();
        const parsed = parseExcelFile(buffer, filename);
        const record: StoredBriefingRecord = {
          id: `briefing_${Date.now()}`,
          title: parsed.fecha !== 'N/C' ? parsed.fecha : filename,
          dateStr: parsed.fecha !== 'N/C' ? parsed.fecha : briefingDate,
          monthStr: briefingMonth,
          isToday: true,
          timestamp: Date.now(),
          csvContent: (parsed.rawMatrix || []).map((r) => r.join(',')).join('\n'),
          uploaderName: uploaderName.trim(),
        };
        saveStoredRecord(record);
        onBriefingLoaded(parsed, record);
        setStatusMessage({ text: `¡Archivo Excel cargado exitosamente por ${uploaderName.trim()}!`, type: 'success' });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: `Error al leer el archivo: ${err.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadGoogleSheet = async () => {
    if (!validateUploaderName()) return;

    if (!sheetUrl.trim()) {
      setStatusMessage({ text: 'Por favor ingresa un enlace válido de Google Sheets', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const parsed = await fetchGoogleSheetCSV(sheetUrl);
      const record: StoredBriefingRecord = {
        id: `briefing_gs_${Date.now()}`,
        title: parsed.fecha !== 'N/C' ? parsed.fecha : 'Hoja de Google Sheets',
        dateStr: parsed.fecha !== 'N/C' ? parsed.fecha : briefingDate,
        monthStr: briefingMonth,
        isToday: true,
        timestamp: Date.now(),
        csvContent: (parsed.rawMatrix || []).map((r) => r.join(',')).join('\n'),
        uploaderName: uploaderName.trim(),
      };
      saveStoredRecord(record);
      onBriefingLoaded(parsed, record);
      setStatusMessage({ text: `¡Google Sheets sincronizado exitosamente por ${uploaderName.trim()}!`, type: 'success' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: `Error al sincronizar Google Sheets: ${err.message}. Asegúrate de que el documento tenga permisos "Cualquier persona con el enlace puede leer".`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteCsv = () => {
    if (!validateUploaderName()) return;
    if (!csvText.trim()) return;

    try {
      const parsed = parseBriefingData(csvText, `briefing_pasted_${Date.now()}`);
      const record: StoredBriefingRecord = {
        id: `briefing_${Date.now()}`,
        title: parsed.fecha !== 'N/C' ? parsed.fecha : 'Briefing pegado manualmente',
        dateStr: parsed.fecha !== 'N/C' ? parsed.fecha : briefingDate,
        monthStr: briefingMonth,
        isToday: true,
        timestamp: Date.now(),
        csvContent: csvText,
        uploaderName: uploaderName.trim(),
      };
      saveStoredRecord(record);
      onBriefingLoaded(parsed, record);
      setStatusMessage({ text: `¡Datos CSV procesados exitosamente por ${uploaderName.trim()}!`, type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: `Error al procesar CSV: ${err.message}`, type: 'error' });
    }
  };

  const isUploaderFilled = uploaderName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0369a1] flex items-center justify-center">
              {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-[#0369a1]" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Montserrat',sans-serif]">
                {isUnlocked ? 'Gestor de Archivos O-Briefing' : 'Acceso Administrativo O-Briefing'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {isUnlocked
                  ? 'Subida de nuevas hojas y consulta por calendario histórico'
                  : 'Ingresa la clave autorizada para cargar o consultar archivos'}
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

        {/* Step 1: Password Gate */}
        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="p-6 space-y-4 font-['Montserrat',sans-serif]">
            <p className="text-xs text-slate-600 leading-relaxed">
              Para proteger la integridad de las tarifas y datos de operación del hotel, se requiere la clave de acceso autorizada:
            </p>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                placeholder="Ingresa la contraseña..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30 font-mono"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {authError}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
              Clave configurada: <code className="font-bold text-slate-800">O-Briefing_2026</code>
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
                className="px-5 py-2 text-xs font-extrabold text-white bg-[#0369a1] hover:bg-[#0284c7] rounded-xl shadow-2xs cursor-pointer"
              >
                Desbloquear y Continuar
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Unlocked Hub (Calendar View & Upload with Mandatory Name) */
          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-['Montserrat',sans-serif]">
            {/* Top View Selector: Calendario vs Subir Hoja */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalMode('upload')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  modalMode === 'upload'
                    ? 'bg-white text-[#0369a1] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4 text-[#0369a1]" />
                <span>Subir Nueva Hoja</span>
              </button>

              <button
                type="button"
                onClick={() => setModalMode('calendar')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  modalMode === 'calendar'
                    ? 'bg-white text-[#0369a1] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-[#0369a1]" />
                <span>Ver Archivos Anteriores (Calendario)</span>
              </button>
            </div>

            {/* Mode 1: Calendar View for browsing previous files */}
            {modalMode === 'calendar' && (
              <div className="pt-1">
                <BriefingCalendarView
                  records={records}
                  activeId={activeId}
                  onSelectRecord={(rec) => {
                    if (onSelectRecord) onSelectRecord(rec);
                    onClose();
                  }}
                  onDeleteRecord={onDeleteRecord}
                  onClose={onClose}
                />
              </div>
            )}

            {/* Mode 2: Upload New Sheet (Mandatory Uploader Name) */}
            {modalMode === 'upload' && (
              <div className="space-y-4">
                {/* MANDATORY: Uploader Name Input */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70">
                  <label className="text-xs font-black uppercase tracking-wider text-amber-900 block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-amber-700" />
                      Nombre de la persona que sube el archivo *
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                      Obligatorio
                    </span>
                  </label>
                  <p className="text-[11px] text-amber-800 mb-2">
                    Para trazabilidad del departamento y control de cambios, es obligatorio registrar el nombre del responsable antes de subir el archivo.
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="Escriba su nombre y puesto (ej. Lic. Roberto Morales - Recepción)"
                    value={uploaderName}
                    onChange={(e) => {
                      setUploaderName(e.target.value);
                      if (e.target.value.trim()) setUploaderNameError('');
                    }}
                    className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-hidden focus:ring-2 font-medium ${
                      uploaderNameError
                        ? 'border-rose-400 focus:ring-rose-200'
                        : isUploaderFilled
                        ? 'border-emerald-400 focus:ring-emerald-200'
                        : 'border-slate-300 focus:ring-[#0369a1]/30'
                    }`}
                  />
                  {uploaderNameError && (
                    <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {uploaderNameError}
                    </p>
                  )}
                  {isUploaderFilled && (
                    <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Responsable verificado: {uploaderName.trim()}
                    </p>
                  )}
                </div>

                {/* Date & Month assignment */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mes de Organización</label>
                    <input
                      type="text"
                      value={briefingMonth}
                      onChange={(e) => setBriefingMonth(e.target.value)}
                      placeholder="ej. Agosto 2026"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fecha del Archivo</label>
                    <input
                      type="date"
                      value={briefingDate}
                      onChange={(e) => setBriefingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* Sub-tabs for input methods */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs w-full">
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer text-center w-full ${
                      activeTab === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0369a1] shrink-0" />
                    <span>Subir Excel / CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('google')}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer text-center w-full ${
                      activeTab === 'google' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Google Sheets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('paste')}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer text-center w-full ${
                      activeTab === 'paste' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Pegar Texto CSV</span>
                  </button>
                </div>

                {/* Status notification */}
                {statusMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {statusMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                {/* Tab 1: Upload Excel/CSV with mandatory uploader validation */}
                {activeTab === 'upload' && (
                  <div className="space-y-3">
                    <label
                      className={`border-2 border-dashed rounded-2xl p-6 text-center block transition-all ${
                        isUploaderFilled
                          ? 'border-[#0369a1]/40 hover:border-[#0369a1] bg-sky-50/20 hover:bg-sky-50/40 cursor-pointer'
                          : 'border-slate-300 bg-slate-50/70 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isUploaderFilled ? 'text-[#0369a1]' : 'text-slate-400'}`} />
                      <span className="text-sm font-bold text-slate-800 block">
                        {isUploaderFilled
                          ? 'Arrastra tu archivo Excel (.xlsx, .xls) o CSV aquí'
                          : '⚠️ Ingrese primero el nombre del responsable arriba para habilitar la subida'}
                      </span>
                      <span className="text-xs text-slate-500 block mt-1">
                        {isUploaderFilled
                          ? 'o haz clic para explorar en tus carpetas locales'
                          : 'El botón de selección se desbloqueará automáticamente'}
                      </span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isLoading || !isUploaderFilled}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 text-center">
                      El parser procesará de inmediato censo, tarifas, eventos y centros de consumo asociándolo a {uploaderName.trim() || 'su usuario'}.
                    </p>
                  </div>
                )}

                {/* Tab 2: Google Sheets URL */}
                {activeTab === 'google' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Enlace de Google Sheets (Drive del Mes)
                      </label>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadGoogleSheet}
                      disabled={isLoading || !isUploaderFilled}
                      className="w-full py-2.5 text-xs font-extrabold text-white bg-[#0369a1] hover:bg-[#0284c7] rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Link className="w-4 h-4" />
                      <span>{isLoading ? 'Sincronizando...' : 'Conectar y Actualizar Briefing'}</span>
                    </button>
                    {!isUploaderFilled && (
                      <p className="text-[11px] text-amber-700 text-center font-medium">
                        * Ingrese el nombre de la persona responsable arriba para habilitar la sincronización.
                      </p>
                    )}
                  </div>
                )}

                {/* Tab 3: Paste CSV */}
                {activeTab === 'paste' && (
                  <div className="space-y-3">
                    <textarea
                      rows={5}
                      placeholder="Pega las filas CSV de tu briefing aquí..."
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handlePasteCsv}
                      disabled={!isUploaderFilled || !csvText.trim()}
                      className="w-full py-2.5 text-xs font-extrabold text-white bg-[#0369a1] hover:bg-[#0284c7] rounded-xl shadow-2xs cursor-pointer disabled:opacity-50 transition-all"
                    >
                      Procesar Texto
                    </button>
                    {!isUploaderFilled && (
                      <p className="text-[11px] text-amber-700 text-center font-medium">
                        * Ingrese el nombre de la persona responsable arriba para habilitar el procesamiento.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
