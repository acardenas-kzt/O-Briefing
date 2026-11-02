import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Search,
  Edit3,
  Save,
  RotateCcw,
  Table,
  HelpCircle,
} from 'lucide-react';
import { BriefingData, CellInspection } from '../../types/briefing';
import { extractCellValueFromMatrix } from '../../utils/briefingParser';

interface CellInspectorViewProps {
  data: BriefingData;
  onUpdateOverride: (key: string, value: string, newCoord?: string) => void;
  onBackToDashboard?: () => void;
  onResetOverrides?: () => void;
  onRevertSingleOverride?: (key: string) => void;
  hasCustomOverrides?: boolean;
}

export const CellInspectorView: React.FC<CellInspectorViewProps> = ({
  data,
  onUpdateOverride,
  onBackToDashboard,
  onResetOverrides,
  onRevertSingleOverride,
  hasCustomOverrides,
}) => {
  const [filter, setFilter] = useState<'all' | 'nc' | 'found'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'variables' | 'matrix'>('variables');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editCoordinate, setEditCoordinate] = useState<string>('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const inspections = data.cellInspections || [];
  const ncCount = inspections.filter((i) => i.status === 'NC').length;

  const sections = Array.from(new Set(inspections.map((i) => i.section)));

  const filteredInspections = inspections.filter((item) => {
    if (filter === 'nc' && item.status !== 'NC') return false;
    if (filter === 'found' && item.status !== 'FOUND') return false;
    if (sectionFilter !== 'all' && item.section !== sectionFilter) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchLabel = item.label.toLowerCase().includes(term);
      const matchKey = item.key.toLowerCase().includes(term);
      const matchVal = item.parsedValue.toLowerCase().includes(term);
      const matchCoord = (item.cellCoordinate || '').toLowerCase().includes(term);
      if (!matchLabel && !matchKey && !matchVal && !matchCoord) return false;
    }

    return true;
  });

  const startEdit = (item: CellInspection) => {
    setEditingKey(item.key);
    const existing =
      item.cellCoordinate && item.cellCoordinate !== 'N/A' && item.cellCoordinate !== 'N/C'
        ? item.cellCoordinate
        : '';
    setEditCoordinate(existing);
  };

  const handleSave = (item: CellInspection) => {
    const formattedCoord = editCoordinate.trim().replace(/\s+/g, '').toUpperCase();
    const finalCoord = formattedCoord || 'N/C';
    const extracted = extractCellValueFromMatrix(data.rawMatrix, finalCoord);
    onUpdateOverride(item.key, extracted, finalCoord);
    setEditingKey(null);
    setSaveNotice(`Ajuste para "${item.label}" guardado en almacenamiento local.`);
    setTimeout(() => {
      setSaveNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Save Notification Toast */}
      {saveNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{saveNotice} Los cambios se mantendrán la próxima vez que cargues la página.</span>
          </div>
          <button
            onClick={() => setSaveNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Explanation Banner */}
      <div className="bg-[#e8f0fe] border border-[#d2e3fc] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-3.5">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#0369a1] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Montserrat',sans-serif]">
                Auditoría Parsel de Celdas ({ncCount} N/C)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Acceso Autorizado
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Persistencia Activa
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mt-1">
              Esta herramienta audita cada celda leída del archivo original. Si una celda cambió de posición o no se encontró en la hoja, aparecerá con la etiqueta{' '}
              <strong className="text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-bold">N/C</strong>{' '}
              (No Coincide / No Corresponde). Cualquier cambio que realices con el botón <strong className="font-bold text-[#1a73e8]">Acomodar</strong> se guarda automáticamente en tu navegador y{' '}
              <span className="font-bold text-slate-900">se mantendrá intacto cuando vuelvas a cargar o refrescar la página</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap flex-shrink-0 self-end sm:self-start">
          {hasCustomOverrides && onResetOverrides && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Deseas restablecer todos los cambios de auditoría a los valores originales del archivo?')) {
                  onResetOverrides();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Restablecer todas las celdas a los valores por defecto del archivo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              Restablecer Celdas
            </button>
          )}

          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="flex-shrink-0 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              ← Salir de Auditoría
            </button>
          )}
        </div>
      </div>

      {/* View Switcher: Variables vs Raw Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('variables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'variables'
                ? 'bg-[#1a73e8] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Variables Mapeadas ({inspections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#1a73e8] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Matriz de Hoja (Grid Original)</span>
          </button>
        </div>

        {/* Filters and search for variables */}
        {activeTab === 'variables' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('nc')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  filter === 'nc' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                <span>Sólo N/C</span>
                {ncCount > 0 && (
                  <span className="px-1 py-0.2 rounded-full text-[10px] bg-white text-amber-800 font-bold">
                    {ncCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter('found')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filter === 'found' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                Encontradas
              </button>
            </div>

            {/* Section filter */}
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="all">Todas las secciones</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar campo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content: Variables Table */}
      {activeTab === 'variables' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-semibold">
                  <th className="py-3 px-4">Sección</th>
                  <th className="py-3 px-4">Campo / Etiqueta</th>
                  <th className="py-3 px-4 text-center">Celda Excel</th>
                  <th className="py-3 px-4">Valor Extraído</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Ajuste Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInspections.map((item) => {
                  const isEditing = editingKey === item.key;
                  const liveValue = isEditing
                    ? extractCellValueFromMatrix(data.rawMatrix, editCoordinate)
                    : item.parsedValue;
                  const displayVal = !liveValue || liveValue.trim() === '' ? 'N/C' : liveValue.trim();
                  const isNC = displayVal === 'N/C';

                  return (
                    <tr
                      key={item.key}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isEditing ? 'bg-sky-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">
                        {item.section}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{item.label}</span>
                          {item.overrideValue !== undefined && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200">
                              Ajustado
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block">{item.key}</span>
                      </td>

                      {/* Celda Excel: editable al dar clic en Acomodar */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isEditing ? (
                          <div className="inline-flex items-center justify-center">
                            <input
                              type="text"
                              value={editCoordinate}
                              onChange={(e) => setEditCoordinate(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave(item);
                                if (e.key === 'Escape') setEditingKey(null);
                              }}
                              placeholder="Ej. B19"
                              className="w-24 px-2 py-1 text-xs font-mono font-bold text-center border-2 border-[#1a73e8] rounded-md focus:outline-hidden bg-white uppercase tracking-wider shadow-inner"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                            item.overrideValue !== undefined
                              ? 'bg-sky-50 text-sky-900 border-sky-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {item.cellCoordinate || 'N/C'}
                          </span>
                        )}
                      </td>

                      {/* Valor Extraído: muestra el texto extraído en vivo o N/C si no hay texto */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`font-mono text-xs truncate max-w-[200px] ${
                              isNC
                                ? 'text-amber-800 font-bold bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300'
                                : 'text-slate-900 font-semibold bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200'
                            }`}
                            title={displayVal}
                          >
                            {displayVal}
                          </span>
                          {isEditing && (
                            <span className="text-[10px] text-[#0369a1] font-semibold">
                              (extraído en vivo)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {!isNC ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Coincide
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" /> N/C
                          </span>
                        )}
                      </td>

                      {/* Ajuste Manual: Botones Acomodar, Guardar y Cancelar */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSave(item)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Guardar coordenada de celda"
                            >
                              <Save className="w-3.5 h-3.5" /> Guardar
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {item.overrideValue !== undefined && onRevertSingleOverride && (
                              <button
                                onClick={() => onRevertSingleOverride(item.key)}
                                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="Revertir este campo al valor original"
                              >
                                <RotateCcw className="w-3 h-3 text-slate-400" /> Revertir
                              </button>
                            )}
                            <button
                              onClick={() => startEdit(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#1a73e8] hover:bg-blue-50 border border-[#d2e3fc] rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Acomodar celda de Excel"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Acomodar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content: Raw Matrix View */}
      {activeTab === 'matrix' && data.rawMatrix && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
          <p className="text-xs text-slate-500 mb-3">
            Mostrando las primeras 40 filas y columnas leídas del archivo CSV/Excel.
          </p>
          <div className="overflow-x-auto max-h-[550px] border border-slate-200 rounded-xl">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-slate-100 sticky top-0 z-10 text-slate-600">
                <tr>
                  <th className="py-1 px-2 border-r border-b border-slate-200 text-center w-12 bg-slate-200">#</th>
                  {Array.from({ length: 10 }).map((_, c) => (
                    <th key={c} className="py-1 px-2 border-r border-b border-slate-200 text-center font-bold">
                      {String.fromCharCode(65 + c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.rawMatrix.slice(0, 45).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-blue-50/40">
                    <td className="py-1 px-2 text-center text-slate-400 bg-slate-50 border-r border-slate-200 font-bold">
                      {rIdx + 1}
                    </td>
                    {Array.from({ length: 10 }).map((_, cIdx) => (
                      <td
                        key={cIdx}
                        className="py-1 px-2 border-r border-slate-100 truncate max-w-[180px] hover:whitespace-normal"
                        title={row[cIdx] || ''}
                      >
                        {row[cIdx] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
