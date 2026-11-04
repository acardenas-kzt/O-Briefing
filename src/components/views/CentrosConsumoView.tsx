import React, { useState } from 'react';
import { UtensilsCrossed, Wine, Search } from 'lucide-react';
import { BriefingData, CentroConsumo } from '../../types/briefing';

interface CentrosConsumoViewProps {
  data: BriefingData;
}

export const CentrosConsumoView: React.FC<CentrosConsumoViewProps> = ({ data }) => {
  const [activeType, setActiveType] = useState<'all' | 'restaurante' | 'bar'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [search, setSearch] = useState('');

  const restaurantes = data.centrosConsumo.filter((c) => c.tipo === 'restaurante');
  const bares = data.centrosConsumo.filter((c) => c.tipo === 'bar');

  const filterItem = (item: CentroConsumo) => {
    // Status filter
    if (statusFilter === 'open' && !item.activo) return false;
    if (statusFilter === 'closed' && item.activo) return false;

    // Search filter
    if (search) {
      const term = search.toLowerCase();
      const matchName = item.nombre.toLowerCase().includes(term);
      const matchObs = item.observaciones.toLowerCase().includes(term);
      const matchCierres = item.cierres.toLowerCase().includes(term);
      const matchDes = item.horarios.desayuno?.toLowerCase().includes(term);
      const matchCom = item.horarios.comida?.toLowerCase().includes(term);
      const matchCen = item.horarios.cena?.toLowerCase().includes(term);
      const matchGen = item.horarios.general?.toLowerCase().includes(term);
      if (!matchName && !matchObs && !matchCierres && !matchDes && !matchCom && !matchCen && !matchGen) return false;
    }

    return true;
  };

  const filteredRestaurantes = restaurantes.filter(filterItem);
  const filteredBares = bares.filter(filterItem);

  const totalRestaurantes = restaurantes.length;
  const totalBares = bares.length;
  const abiertosHoy = data.centrosConsumo.filter((c) => c.activo).length;

  const showRestaurantes = activeType === 'all' || activeType === 'restaurante';
  const showBares = activeType === 'all' || activeType === 'bar';

  // Placeholder empty rows to match spreadsheet template style
  const emptyRowsRest = search ? 0 : 5;
  const emptyRowsBares = search ? 0 : 4;

  return (
    <div className="space-y-6">
      {/* Filter and stats toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveType('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeType === 'all'
                ? 'bg-[#0369a1] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Todos</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeType === 'all' ? 'bg-sky-200/40 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {data.centrosConsumo.length}
            </span>
          </button>

          <button
            onClick={() => setActiveType('restaurante')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeType === 'restaurante'
                ? 'bg-[#0369a1] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restaurantes</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeType === 'restaurante' ? 'bg-sky-200/40 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {totalRestaurantes}
            </span>
          </button>

          <button
            onClick={() => setActiveType('bar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeType === 'bar'
                ? 'bg-[#0369a1] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span>Bares & Cafés</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeType === 'bar' ? 'bg-sky-200/40 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {totalBares}
            </span>
          </button>
        </div>

        {/* Right side controls: status filter + search */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'open' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Abiertos ({abiertosHoy})
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'closed' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cerrados
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar centro de consumo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Container: Column layout with side-by-side (7:5 desktop ratio) or stacked tables */}
      <div className={`grid gap-6 items-start ${
        activeType === 'all' ? 'grid-cols-1 2xl:grid-cols-12 print:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* COLUMN 1: RESTAURANTES TABLE */}
        {showRestaurantes && (
          <div className={`w-full ${activeType === 'all' ? '2xl:col-span-7 print:col-span-1' : ''}`}>
            {/* Header Banner */}
            <div className="bg-[#1a2536] text-white text-center py-2.5 px-4 font-black text-sm tracking-wider uppercase rounded-t-xl shadow-2xs">
              RESTAURANTES
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto border border-t-0 border-slate-200 rounded-b-xl shadow-2xs bg-white [scrollbar-width:thin]">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#edf2f7] text-slate-800 font-black text-[10px] tracking-wide uppercase">
                    <th className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap min-w-[75px]">
                      CIERRES
                    </th>
                    <th className="border border-slate-200 px-2.5 py-2 text-center min-w-[135px]">
                      RESTAURANTES
                    </th>
                    <th className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap min-w-[75px] bg-[#e65c00] text-white font-black">
                      DESAYUNO
                    </th>
                    <th className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap min-w-[75px] bg-[#009b8d] text-white font-black">
                      COMIDA
                    </th>
                    <th className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap min-w-[80px] bg-[#5b2182] text-white font-black">
                      CENA
                    </th>
                    <th className="border border-slate-200 px-2.5 py-2 text-center min-w-[130px]">
                      OBSERVACIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRestaurantes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border border-slate-200 py-6 text-center text-slate-400 italic">
                        No se encontraron restaurantes con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    filteredRestaurantes.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          !item.activo ? 'bg-slate-50/40 opacity-75' : 'bg-white'
                        }`}
                      >
                        {/* Cierres */}
                        <td className="border border-slate-200 px-2 py-1.5 text-center text-[10px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                          {item.cierres && item.cierres !== '-' ? item.cierres : ''}
                        </td>

                        {/* Nombre del Restaurante */}
                        <td
                          className={`border border-slate-200 px-2.5 py-1.5 text-center text-[11px] uppercase tracking-tight ${
                            item.activo ? 'font-bold text-slate-900' : 'font-semibold text-slate-400'
                          }`}
                        >
                          {item.nombre}
                        </td>

                        {/* Desayuno */}
                        <td className="border border-slate-200 px-2 py-1.5 text-center text-[11px] font-medium text-slate-700 whitespace-nowrap">
                          {item.horarios.desayuno ? (
                            item.horarios.desayuno
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>

                        {/* Comida */}
                        <td className="border border-slate-200 px-2 py-1.5 text-center text-[11px] font-medium text-slate-700 whitespace-nowrap">
                          {item.horarios.comida ? (
                            item.horarios.comida
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>

                        {/* Cena */}
                        <td className="border border-slate-200 px-2 py-1.5 text-center text-[11px] font-medium text-slate-700">
                          {item.horarios.cena ? (
                            item.horarios.cena
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>

                        {/* Observaciones */}
                        <td className="border border-slate-200 px-2.5 py-1.5 text-center text-[10px] font-semibold text-slate-600 uppercase">
                          {item.observaciones ? item.observaciones : ''}
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Empty trailing rows for spreadsheet look */}
                  {Array.from({ length: emptyRowsRest }).map((_, idx) => (
                    <tr key={`rest_empty_${idx}`} className="bg-slate-50/20">
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2.5 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2.5 py-1.5 text-center text-slate-400"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COLUMN 2: BARES TABLE */}
        {showBares && (
          <div className={`w-full ${activeType === 'all' ? '2xl:col-span-5 print:col-span-1' : ''}`}>
            {/* Header Banner */}
            <div className="bg-[#1a2536] text-white text-center py-2.5 px-4 font-black text-sm tracking-wider uppercase rounded-t-xl shadow-2xs">
              BARES
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto border border-t-0 border-slate-200 rounded-b-xl shadow-2xs bg-white [scrollbar-width:thin]">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#edf2f7] text-slate-800 font-black text-[10px] tracking-wide uppercase">
                    <th className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap min-w-[75px]">
                      CIERRES
                    </th>
                    <th className="border border-slate-200 px-2.5 py-2 text-center min-w-[130px]">
                      BARES
                    </th>
                    <th className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap min-w-[95px]">
                      HORARIO
                    </th>
                    <th className="border border-slate-200 px-2.5 py-2 text-center min-w-[125px]">
                      OBSERVACIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBares.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-slate-200 py-6 text-center text-slate-400 italic">
                        No se encontraron bares con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    filteredBares.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          !item.activo ? 'bg-slate-50/40 opacity-75' : 'bg-white'
                        }`}
                      >
                        {/* Cierres */}
                        <td className="border border-slate-200 px-2 py-1.5 text-center text-[10px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                          {item.cierres && item.cierres !== '-' ? item.cierres : ''}
                        </td>

                        {/* Nombre del Bar */}
                        <td
                          className={`border border-slate-200 px-2.5 py-1.5 text-center text-[11px] uppercase tracking-tight ${
                            item.activo ? 'font-bold text-slate-900' : 'font-semibold text-slate-400'
                          }`}
                        >
                          {item.nombre}
                        </td>

                        {/* Horario */}
                        <td className="border border-slate-200 px-2 py-1.5 text-center text-[11px] font-medium text-slate-700 whitespace-nowrap">
                          {item.horarios.general ? (
                            item.horarios.general
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>

                        {/* Observaciones */}
                        <td className="border border-slate-200 px-2.5 py-1.5 text-center text-[10px] font-semibold text-slate-600 uppercase">
                          {item.observaciones ? item.observaciones : ''}
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Empty trailing rows for spreadsheet look */}
                  {Array.from({ length: emptyRowsBares }).map((_, idx) => (
                    <tr key={`bar_empty_${idx}`} className="bg-slate-50/20">
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-400"></td>
                      <td className="border border-slate-200 px-2.5 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2.5 py-1.5 text-center text-slate-400">-</td>
                      <td className="border border-slate-200 px-2.5 py-1.5 text-center text-slate-400"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
