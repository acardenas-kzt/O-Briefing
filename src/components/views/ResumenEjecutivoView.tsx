import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ArrowRight,
  SunMedium,
  CloudSun,
  Star,
  Droplets,
} from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface ResumenEjecutivoViewProps {
  data: BriefingData;
  onNavigateToTab: (tab: any) => void;
}

export const ResumenEjecutivoView: React.FC<ResumenEjecutivoViewProps> = ({ data, onNavigateToTab }) => {
  return (
    <div className="space-y-6">
      {/* 3 Divs in a Single Row, with AUDITORIA DE CIERRE first */}
      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-5 mb-[40px] print:mb-6">
        {/* 1. AUDITORÍA CIERRE ANTERIOR (Al principio) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#0369a1]">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#0369a1]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-['Montserrat',sans-serif]">
                  Auditoría de Cierre
                </h3>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#0369a1] bg-sky-100 px-2 py-0.5 rounded">
                {data.censoCierre.ocupacionPct}
              </span>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Fecha Cierre</span>
                <span className="font-mono text-slate-900 font-bold">
                  {data.censoCierre.fecha.replace(/CIERRE DEL DÍA\s*/i, '')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Habitaciones Ocupadas</span>
                <span className="font-mono text-slate-900 font-bold">{data.censoCierre.habitaciones}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Llegadas / Salidas</span>
                <span className="font-mono font-bold text-slate-800">
                  <span className="text-emerald-600">+{data.censoCierre.llegadas}</span> /{' '}
                  <span className="text-rose-600">-{data.censoCierre.salidas}</span>
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Total Huéspedes Complejo</span>
                <span className="font-mono text-[#0369a1] font-bold">
                  {data.huespedesEnCasa.total.complejo} PAX
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[10px]">Cierre Complejo</span>
            <button
              onClick={() => onNavigateToTab('censo')}
              className="text-[#0369a1] hover:underline font-bold flex items-center gap-1 cursor-pointer text-xs"
            >
              Ver Censo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Grand Oasis Cancún Box */}
        <div className="p-5 bg-[#F8FDFF] border border-[#dff2fe] rounded-xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#0369a1]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0369a1] font-['Montserrat',sans-serif]">
                Grand Oasis Cancún
              </h3>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Habitaciones Ocupadas</span>
                <span className="font-mono text-slate-900 font-bold">{data.previsionGOC.habOcupadas}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Llegadas</span>
                <span className="font-mono text-emerald-600 font-bold">+{data.previsionGOC.llegadas}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Salidas</span>
                <span className="font-mono text-rose-600 font-bold">-{data.previsionGOC.salidas}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Huéspedes (Adultos / Menores)</span>
                <span className="font-mono text-slate-900 font-bold">
                  {data.huespedesEnCasa.adultos.goc} / {data.huespedesEnCasa.menores.goc}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[10px]">Previsión GOC</span>
            <span className="font-mono font-bold text-slate-700 text-[11px]">
              Total: {data.huespedesEnCasa.total.goc} PAX
            </span>
          </div>
        </div>

        {/* 3. The Pyramid Box */}
        <div className="p-5 bg-[#f4f4f5] border border-zinc-200 rounded-xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black font-['Montserrat',sans-serif]">
                The Pyramid
              </h3>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-2 border-b border-zinc-200">
                <span className="text-slate-500 font-medium">Habitaciones Ocupadas</span>
                <span className="font-mono text-slate-900 font-bold">{data.previsionPYR.habOcupadas}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200">
                <span className="text-slate-500 font-medium">Llegadas</span>
                <span className="font-mono text-emerald-600 font-bold">+{data.previsionPYR.llegadas}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200">
                <span className="text-slate-500 font-medium">Salidas</span>
                <span className="font-mono text-rose-600 font-bold">-{data.previsionPYR.salidas}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Huéspedes (Adultos / Menores)</span>
                <span className="font-mono text-slate-900 font-bold">
                  {data.huespedesEnCasa.adultos.pyr} / {data.huespedesEnCasa.menores.pyr}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[10px]">Previsión PYR</span>
            <span className="font-mono font-bold text-black text-[11px]">
              Total: {data.huespedesEnCasa.total.pyr} PAX
            </span>
          </div>
        </div>
      </div>

      {/* Row: Tipos de Cambio y Pronóstico del Clima en la misma fila */}
        {/* Contenido en 2 Columnas: Tipo de Cambio (400px) + Clima (amplio, 1fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-stretch">
          {/* 1. TIPO DE CAMBIO (400px) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-['Montserrat',sans-serif] uppercase tracking-wider">
                    TIPO DE CAMBIO
                  </h4>
                </div>
                <span className="font-mono text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-1 text-sm font-bold inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">DOF:</span>
                  <span className="text-slate-900 font-black text-base">{data.tipoCambio.dof || '$16.9647'}</span>
                </span>
              </div>

              {/* 4 Cards de Divisas: Distribuidas en 2x2 limpias sin spans redundantes */}
              <div className="grid grid-cols-2 gap-3.5 my-2">
                {[
                  { name: 'Dólar USD', rate: data.tipoCambio.usd, highlight: true },
                  { name: 'Euro', rate: data.tipoCambio.eur, highlight: false },
                  { name: 'Dólar Canadiense', rate: data.tipoCambio.cad, highlight: false },
                  { name: 'Libra Esterlina', rate: data.tipoCambio.gbp, highlight: false },
                ].map((curr) => (
                  <div
                    key={curr.name}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                      curr.highlight
                        ? 'bg-[#F8FDFF] border-[#0369a1]/30 shadow-2xs ring-1 ring-[#0369a1]/10'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      {curr.name}
                    </span>
                    <div className="font-mono text-2xl font-black text-slate-900 leading-tight">
                      {curr.rate}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      MXN
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. CLIMA (Expandido en ancho) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <SunMedium className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-['Montserrat',sans-serif] uppercase tracking-wider">
                    CLIMA
                  </h4>
                </div>
                <span className="font-mono text-[11px] text-[#0369a1] bg-sky-50 border border-sky-200/70 px-2.5 py-0.5 rounded font-bold">
                  Cancún
                </span>
              </div>

              {/* Tiras de 5 días de pronóstico meteorológico ampliado */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-1">
                {data.clima.slice(0, 5).map((dia, idx) => {
                  const tempMax = dia.max ? dia.max.replace(/\D/g, '') || '32' : '32';
                  const tempMin = dia.min ? dia.min.replace(/\D/g, '') || '26' : '26';
                  const prob = dia.probabilidad && dia.probabilidad !== 'N/C' ? dia.probabilidad : '30%';
                  const dayParts = dia.dia.trim().split(/\s+/);
                  const dayLabel = dayParts[0]?.slice(0, 3)?.toUpperCase() || 'DÍA';
                  const dayNum = dayParts[1] || '';
                  const isToday = idx === 0;

                  return (
                    <div
                      key={idx}
                      className={`p-3 sm:p-3.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                        isToday
                          ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
                            isToday ? 'text-amber-800' : 'text-slate-500'
                          }`}
                        >
                          {dayLabel} {dayNum}
                        </span>
                        <div className="my-2.5 flex justify-center">
                          <CloudSun
                            className={`w-7 h-7 ${isToday ? 'text-amber-500' : 'text-slate-400'}`}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 line-clamp-1 font-medium block">
                          {dia.condicion || 'Nublado'}
                        </span>
                      </div>

                      <div className="mt-3 w-full pt-2.5 border-t border-slate-200/60">
                        <div className="font-mono">
                          <span className="text-lg font-black text-slate-900 block leading-none">
                            {tempMax}°C
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                            Mín {tempMin}°C
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 py-0.5 rounded border border-sky-100">
                          <Droplets className="w-2.5 h-2.5 text-sky-500" />
                          <span>{prob}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      </div>

      {/* Auditoría de Reputación y Comunidad Digital */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                COMUNIDAD DIGITAL
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            Monitoreo Continuo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {data.comunidadDigital.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {item.canal}
                </span>
                <div className="mb-2">
                  <span className="text-[10px] text-slate-500 block">Grand Oasis:</span>
                  <span className="text-xs font-bold text-slate-800">{item.goc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#1a73e8] block">The Pyramid:</span>
                  <span className="text-xs font-black text-[#1a73e8]">{item.pyr}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

