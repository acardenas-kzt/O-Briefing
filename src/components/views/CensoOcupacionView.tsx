import React, { useState } from 'react';
import {
  Users,
  Crown,
  Sparkles,
  Cake,
  Eye,
  Calendar,
  Search,
  BedDouble,
  LogOut,
  Building,
  CheckCircle2,
  X,
} from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface CensoOcupacionViewProps {
  data: BriefingData;
}

export const CensoOcupacionView: React.FC<CensoOcupacionViewProps> = ({ data }) => {
  const [vipSearch, setVipSearch] = useState('');
  const [vipFilter, setVipFilter] = useState<'all' | 'llegando' | 'enCasa' | 'saliendo'>('all');
  const [otlcSearch, setOtlcSearch] = useState('');

  const filteredVips = () => {
    const term = vipSearch.toLowerCase();
    const matches = (item: { nombre: string; habitacion?: string }) =>
      item.nombre.toLowerCase().includes(term) || (item.habitacion && item.habitacion.toLowerCase().includes(term));

    const llegando = (vipFilter === 'all' || vipFilter === 'llegando') ? data.vips.llegando.filter(matches) : [];
    const enCasa = (vipFilter === 'all' || vipFilter === 'enCasa') ? data.vips.enCasa.filter(matches) : [];
    const saliendo = (vipFilter === 'all' || vipFilter === 'saliendo') ? data.vips.saliendo.filter(matches) : [];

    return { llegando, enCasa, saliendo };
  };

  const vipsLists = filteredVips();

  // OTLC Base Lists
  const casaCol1 =
    data.sociosOTLC.enCasaCol1 && data.sociosOTLC.enCasaCol1.length > 0
      ? data.sociosOTLC.enCasaCol1
      : data.sociosOTLC.enCasa.slice(0, 18);

  const casaCol2 =
    data.sociosOTLC.enCasaCol2 && data.sociosOTLC.enCasaCol2.length > 0
      ? data.sociosOTLC.enCasaCol2
      : data.sociosOTLC.enCasa.slice(18);

  const totalSociosOTLC =
    data.sociosOTLC.llegando.length +
    data.sociosOTLC.nuevos.length +
    data.sociosOTLC.saliendo.length +
    casaCol1.length +
    casaCol2.length;

  // OTLC Search filtering
  const matchesOtlc = (item: { nombre: string; habitacion?: string; fecha?: string }) => {
    if (!otlcSearch.trim()) return true;
    const term = otlcSearch.toLowerCase().trim();
    const nombreMatch = item.nombre ? item.nombre.toLowerCase().includes(term) : false;
    const habMatch = item.habitacion ? item.habitacion.toLowerCase().includes(term) : false;
    const fechaMatch = item.fecha ? item.fecha.toLowerCase().includes(term) : false;
    return nombreMatch || habMatch || fechaMatch;
  };

  const filteredLlegando = data.sociosOTLC.llegando.filter(matchesOtlc);
  const filteredNuevos = data.sociosOTLC.nuevos.filter(matchesOtlc);
  const filteredSaliendo = data.sociosOTLC.saliendo.filter(matchesOtlc);

  const rawCasaList =
    (data.sociosOTLC.enCasaCol1 && data.sociosOTLC.enCasaCol1.length > 0) ||
    (data.sociosOTLC.enCasaCol2 && data.sociosOTLC.enCasaCol2.length > 0)
      ? [...(data.sociosOTLC.enCasaCol1 || []), ...(data.sociosOTLC.enCasaCol2 || [])]
      : data.sociosOTLC.enCasa;

  const filteredCasaFull = rawCasaList.filter(matchesOtlc);
  const casaMidpoint = Math.ceil(filteredCasaFull.length / 2);
  const filteredCasaCol1 = otlcSearch.trim() ? filteredCasaFull.slice(0, casaMidpoint) : casaCol1;
  const filteredCasaCol2 = otlcSearch.trim() ? filteredCasaFull.slice(casaMidpoint) : casaCol2;

  // Reusable compact list row renderer for socios (formato lista comprimida, sin cuadros)
  const renderSocioRow = (socio: { nombre: string; habitacion?: string; fecha?: string }, idx: number) => {
    const formattedHab = socio.habitacion
      ? socio.habitacion.toUpperCase().startsWith('HAB')
        ? socio.habitacion
        : `HAB.${socio.habitacion}`
      : '-';

    return (
      <li
        key={idx}
        className="flex items-center justify-between text-xs px-2 hover:bg-amber-50/50 rounded transition-colors group border-b border-slate-100/70 last:border-b-0 h-[25px]"
      >
        <div className="flex items-center min-w-0 flex-1 pr-2">
          <span className="font-semibold text-slate-800 truncate text-left group-hover:text-amber-950 transition-colors" title={socio.nombre}>
            {socio.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono font-bold text-slate-700 bg-[#eaeff4] px-2 h-[20px] inline-flex items-center justify-center rounded text-[11px] min-w-[68px] text-center border border-slate-200/50">
            {formattedHab}
          </span>
          <span className="text-slate-400 font-mono text-[11px] font-medium w-12 text-right">
            {socio.fecha || '-'}
          </span>
        </div>
      </li>
    );
  };

  // Reusable centered row renderer for Huéspedes VIP (w-[350px] h-[30px])
  const renderVipRow = (
    vip: { nombre: string; habitacion?: string; fecha?: string },
    idx: number,
    colorTheme?: 'emerald' | 'sky' | 'rose'
  ) => {
    let hoverBg = 'hover:bg-slate-50';
    let hoverBorder = 'hover:border-slate-300';
    let habBadgeBg = 'bg-slate-100 text-slate-700 border-slate-200/60';
    if (colorTheme === 'emerald') {
      hoverBg = 'hover:bg-emerald-50/50';
      hoverBorder = 'hover:border-emerald-200/80';
      habBadgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
    } else if (colorTheme === 'sky') {
      hoverBg = 'hover:bg-sky-50/50';
      hoverBorder = 'hover:border-sky-200/80';
      habBadgeBg = 'bg-sky-50 text-[#0369a1] border-sky-200/60';
    } else if (colorTheme === 'rose') {
      hoverBg = 'hover:bg-rose-50/50';
      hoverBorder = 'hover:border-rose-200/80';
      habBadgeBg = 'bg-rose-50 text-rose-800 border-rose-200/60';
    }

    const formattedHab = vip.habitacion
      ? vip.habitacion.toUpperCase().startsWith('HAB')
        ? vip.habitacion
        : `HAB.${vip.habitacion}`
      : '-';

    return (
      <div
        key={idx}
        className={`w-[350px] max-w-full h-[30px] mx-auto flex items-center justify-between text-xs px-3.5 ${hoverBg} rounded-xl transition-all group border border-slate-100/90 ${hoverBorder} bg-white shadow-2xs hover:shadow-xs`}
      >
        <span className="font-semibold text-slate-800 truncate pr-2.5 flex-1 text-left" title={vip.nombre}>
          {vip.nombre}
        </span>
        <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold shrink-0 text-center text-[11px] min-w-[72px] border ${habBadgeBg}`}>
          {formattedHab}
        </span>
        <span className="text-slate-500 font-mono text-[11px] font-semibold shrink-0 text-right w-14 pl-1">
          {vip.fecha || '-'}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Metrics: Cierre, Previsiones y Huéspedes en Casa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Cierre del Día */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Cierre ({data.censoCierre.fecha !== 'N/C' ? data.censoCierre.fecha.replace(/CIERRE DEL DÍA\s*/i, '') : 'Día Anterior'})
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
              Ocupación: {data.censoCierre.ocupacionPct}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Habitaciones Ocupadas:</span>
              <span className="font-bold text-slate-900">{data.censoCierre.habitaciones}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Llegadas del cierre:</span>
              <span className="font-semibold text-emerald-600">{data.censoCierre.llegadas}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Salidas del cierre:</span>
              <span className="font-semibold text-rose-600">{data.censoCierre.salidas}</span>
            </div>
          </div>
        </div>

        {/* Previsión Grand Oasis vs The Pyramid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Previsión Operativa
            </h3>
            <span className="text-[11px] text-slate-500">GOC vs The Pyramid</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">Grand Oasis</span>
              <p className="text-slate-500">Hab: <strong className="text-slate-800">{data.previsionGOC.habOcupadas}</strong></p>
              <p className="text-emerald-600 font-medium">Lleg: +{data.previsionGOC.llegadas}</p>
              <p className="text-rose-600 font-medium">Sal: -{data.previsionGOC.salidas}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">The Pyramid</span>
              <p className="text-slate-500">Hab: <strong className="text-slate-800">{data.previsionPYR.habOcupadas}</strong></p>
              <p className="text-emerald-600 font-medium">Lleg: +{data.previsionPYR.llegadas}</p>
              <p className="text-rose-600 font-medium">Sal: -{data.previsionPYR.salidas}</p>
            </div>
          </div>
        </div>

        {/* Huéspedes en Casa */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Huéspedes en Casa
            </h3>
            <span className="text-xs font-bold text-[#1a73e8]">
              {data.huespedesEnCasa.total.complejo} PAX
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Adultos:</span>
              <span className="font-bold text-slate-800">
                {data.huespedesEnCasa.adultos.complejo} (GOC {data.huespedesEnCasa.adultos.goc} / PYR {data.huespedesEnCasa.adultos.pyr})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Menores:</span>
              <span className="font-bold text-slate-800">
                {data.huespedesEnCasa.menores.complejo} (GOC {data.huespedesEnCasa.menores.goc} / PYR {data.huespedesEnCasa.menores.pyr})
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Total Complejo:</span>
              <span className="font-black text-[#1a73e8]">
                GOC: {data.huespedesEnCasa.total.goc} | PYR: {data.huespedesEnCasa.total.pyr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Planeación Semanal (5 Días) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1a73e8]" />
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                PLANEACIÓN SEMANAL Y PROYECCIONES DE OCUPACIÓN
              </h3>
              <p className="text-xs text-slate-500">Tendencia de llegadas, salidas y porcentaje de ocupación</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80">
                <th className="py-2.5 px-3 font-semibold rounded-l-lg">Día</th>
                <th className="py-2.5 px-3 font-semibold text-center">Llegadas</th>
                <th className="py-2.5 px-3 font-semibold text-center">Salidas</th>
                <th className="py-2.5 px-3 font-semibold text-center">Habitaciones Ocupadas</th>
                <th className="py-2.5 px-3 font-semibold text-center">Ocupación Complejo</th>
                <th className="py-2.5 px-3 font-semibold rounded-r-lg">Proyección Gráfica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.planeacionSemanal.map((dia, idx) => {
                const pctNumber = parseFloat(dia.totalComplejo.replace(/%/g, '')) || 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {dia.dia}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">
                      +{dia.llegadas}
                    </td>
                    <td className="py-3 px-3 text-center text-rose-600 font-bold">
                      -{dia.salidas}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {dia.habOcupadas}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-slate-900 text-sm">
                      {dia.totalComplejo}
                    </td>
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1a73e8]"
                            style={{ width: `${Math.min(pctNumber, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 w-10 text-right">
                          {dia.totalComplejo}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Socios OTLC & Huéspedes VIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Socios The Leisure Club (OTLC) - Full Width Card */}
        <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                SOCIOS THE LEISURE CLUB (OTLC) ({totalSociosOTLC})
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100/80">
                Llegando: {filteredLlegando.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-semibold border border-sky-100/80">
                En Casa: {filteredCasaCol1.length + filteredCasaCol2.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold border border-indigo-100/80">
                Nuevos: {filteredNuevos.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-semibold border border-rose-100/80">
                Saliendo: {filteredSaliendo.length}
              </span>
            </div>
          </div>

          {/* Barra de Búsqueda de Socios OTLC */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar socio por nombre, habitación o fecha..."
              value={otlcSearch}
              onChange={(e) => setOtlcSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30 font-medium"
            />
            {otlcSearch && (
              <button
                onClick={() => setOtlcSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cuerpo en 3 Columnas Distribuidas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 gap-6 lg:gap-8">
            {/* Columna 1: Socios Llegando (E:32), Socios Nuevos (E:34), Socios Saliendo (E:36) */}
            <div className="space-y-5">
              {/* 1.1 Socios Llegando */}
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Socios Llegando
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                    {filteredLlegando.length}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100/70">
                  {filteredLlegando.length > 0 ? (
                    filteredLlegando.map(renderSocioRow)
                  ) : (
                    <li className="text-xs text-slate-400 italic text-center py-2 list-none">
                      {otlcSearch ? 'Sin resultados para la búsqueda' : 'Sin socios llegando'}
                    </li>
                  )}
                </ul>
              </div>

              {/* 1.2 Socios Nuevos */}
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                    Socios Nuevos
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                    {filteredNuevos.length}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100/70">
                  {filteredNuevos.length > 0 ? (
                    filteredNuevos.map(renderSocioRow)
                  ) : (
                    <li className="text-xs text-slate-400 italic text-center py-2 list-none">
                      {otlcSearch ? 'Sin resultados para la búsqueda' : 'Sin socios nuevos'}
                    </li>
                  )}
                </ul>
              </div>

              {/* 1.3 Socios Saliendo */}
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    Socios Saliendo
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                    {filteredSaliendo.length}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100/70">
                  {filteredSaliendo.length > 0 ? (
                    filteredSaliendo.map(renderSocioRow)
                  ) : (
                    <li className="text-xs text-slate-400 italic text-center py-2 list-none">
                      {otlcSearch ? 'Sin resultados para la búsqueda' : 'Sin socios saliendo'}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Columna 2: Socios en Casa (Celda G:32) */}
            <div className="pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                  <span className="w-2 h-2 rounded-full bg-[#0369a1] inline-block" />
                  Socios en Casa
                </span>
                <span className="text-[10px] font-bold text-[#0369a1] bg-sky-100 px-2 py-0.5 rounded-full font-mono">
                  {filteredCasaCol1.length}
                </span>
              </div>
              <ul className="divide-y divide-slate-100/70">
                {filteredCasaCol1.length > 0 ? (
                  filteredCasaCol1.map(renderSocioRow)
                ) : (
                  <li className="text-xs text-slate-400 italic text-center py-2 list-none">
                    {otlcSearch ? 'Sin resultados para la búsqueda' : 'Sin socios en casa'}
                  </li>
                )}
              </ul>
            </div>

            {/* Columna 3: Socios en Casa (Celda I:32) */}
            <div className="pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                  <span className="w-2 h-2 rounded-full bg-[#0369a1] inline-block" />
                  Socios en Casa
                </span>
                <span className="text-[10px] font-bold text-[#0369a1] bg-sky-100 px-2 py-0.5 rounded-full font-mono">
                  {filteredCasaCol2.length}
                </span>
              </div>
              <ul className="divide-y divide-slate-100/70">
                {filteredCasaCol2.length > 0 ? (
                  filteredCasaCol2.map(renderSocioRow)
                ) : (
                  <li className="text-xs text-slate-400 italic text-center py-2 list-none">
                    {otlcSearch ? 'Sin resultados para la búsqueda' : 'Sin socios en casa'}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Huéspedes VIP - Full Width */}
        <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                Huéspedes VIP ({data.vips.llegando.length + data.vips.enCasa.length + data.vips.saliendo.length})
              </h3>
            </div>
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setVipFilter('all')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors ${
                  vipFilter === 'all' ? 'bg-[#0369a1] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todos ({data.vips.llegando.length + data.vips.enCasa.length + data.vips.saliendo.length})
              </button>
              <button
                onClick={() => setVipFilter('llegando')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors ${
                  vipFilter === 'llegando' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Llegando ({data.vips.llegando.length})
              </button>
              <button
                onClick={() => setVipFilter('enCasa')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors ${
                  vipFilter === 'enCasa' ? 'bg-[#0369a1] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                En Casa ({data.vips.enCasa.length})
              </button>
              <button
                onClick={() => setVipFilter('saliendo')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors ${
                  vipFilter === 'saliendo' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Saliendo ({data.vips.saliendo.length})
              </button>
            </div>
          </div>

          {/* Search Input for VIP */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar VIP por nombre o habitación..."
              value={vipSearch}
              onChange={(e) => setVipSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30 font-medium"
            />
            {vipSearch && (
              <button
                onClick={() => setVipSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lists layout */}
          {vipFilter === 'all' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Col 1: VIPs Llegando */}
              <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5">
                <div className="w-[350px] max-w-full mx-auto flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-200/60">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    VIPs Llegando
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {vipsLists.llegando.length}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {vipsLists.llegando.length > 0 ? (
                    vipsLists.llegando.map((vip, idx) => renderVipRow(vip, idx, 'emerald'))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2 text-center w-[350px] max-w-full mx-auto">Sin registros</p>
                  )}
                </div>
              </div>

              {/* Col 2: VIPs En Casa */}
              <div className="bg-sky-50/30 border border-sky-100 rounded-xl p-3.5">
                <div className="w-[350px] max-w-full mx-auto flex items-center justify-between pb-2 mb-2.5 border-b border-sky-200/60">
                  <span className="text-[11px] font-bold text-[#0369a1] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0369a1] inline-block" />
                    VIPs En Casa
                  </span>
                  <span className="text-[10px] font-bold text-[#0369a1] bg-sky-100 px-2 py-0.5 rounded-full">
                    {vipsLists.enCasa.length}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {vipsLists.enCasa.length > 0 ? (
                    vipsLists.enCasa.map((vip, idx) => renderVipRow(vip, idx, 'sky'))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2 text-center w-[350px] max-w-full mx-auto">Sin registros</p>
                  )}
                </div>
              </div>

              {/* Col 3: VIPs Saliendo */}
              <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-3.5">
                <div className="w-[350px] max-w-full mx-auto flex items-center justify-between pb-2 mb-2.5 border-b border-rose-200/60">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    VIPs Saliendo
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    {vipsLists.saliendo.length}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {vipsLists.saliendo.length > 0 ? (
                    vipsLists.saliendo.map((vip, idx) => renderVipRow(vip, idx, 'rose'))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2 text-center w-[350px] max-w-full mx-auto">Sin registros</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {(vipFilter === 'llegando' ? vipsLists.llegando : vipFilter === 'enCasa' ? vipsLists.enCasa : vipsLists.saliendo).map((vip, idx) =>
                renderVipRow(vip, idx, vipFilter === 'llegando' ? 'emerald' : vipFilter === 'enCasa' ? 'sky' : 'rose')
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Visitas de Inspección & Huéspedes Celebrando */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitas de Inspección */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Eye className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Visitas de Inspección & FAM Trips ({data.visitasInspeccion.length})
            </h3>
          </div>
          {data.visitasInspeccion.length > 0 ? (
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {data.visitasInspeccion.map((visita, idx) => (
                <div
                  key={idx}
                  className="w-[350px] max-w-full h-[30px] mx-auto flex items-center justify-between text-xs px-3.5 hover:bg-emerald-50/50 rounded-xl transition-all group border border-slate-100/90 hover:border-emerald-200/80 bg-white shadow-2xs hover:shadow-xs"
                >
                  <span className="font-semibold text-slate-800 truncate pr-2.5 flex-1 text-left" title={visita.nombre}>
                    {visita.nombre}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 font-mono font-bold text-emerald-800 shrink-0 text-center text-[11px] min-w-[72px] border border-emerald-200/60">
                    {visita.pax || 'INSP'}
                  </span>
                  <span className="text-emerald-700 font-mono text-[11px] font-semibold shrink-0 text-right w-14 pl-1">
                    FAM TRIP
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3 italic text-center w-[350px] max-w-full mx-auto">No hay visitas de inspección registradas para hoy.</p>
          )}
        </div>

        {/* Huéspedes Celebrando */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Cake className="w-5 h-5 text-pink-500" />
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Huéspedes Celebrando ({data.huespedesCelebrando.length})
            </h3>
          </div>
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {data.huespedesCelebrando.map((huesped, idx) => {
              const formattedHab = huesped.habitacion
                ? huesped.habitacion.toUpperCase().startsWith('HAB')
                  ? huesped.habitacion
                  : `HAB.${huesped.habitacion}`
                : '-';
              return (
                <div
                  key={idx}
                  className="w-[350px] max-w-full h-[30px] mx-auto flex items-center justify-between text-xs px-3.5 hover:bg-pink-50/50 rounded-xl transition-all group border border-slate-100/90 hover:border-pink-200/80 bg-white shadow-2xs hover:shadow-xs"
                >
                  <span className="font-semibold text-slate-800 truncate pr-2.5 flex-1 text-left" title={huesped.nombre}>
                    {huesped.nombre}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-700 shrink-0 text-center text-[11px] min-w-[72px] border border-slate-200/60">
                    {formattedHab}
                  </span>
                  <span className="text-pink-700 font-mono text-[10px] font-semibold shrink-0 text-right w-20 truncate pl-1" title={huesped.motivo}>
                    {huesped.motivo || 'CELEBRACIÓN'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
