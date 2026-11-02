import React from 'react';
import { Sparkles, Calendar, Bell, Users, BedDouble, TrendingUp, DollarSign } from 'lucide-react';
import { BriefingData } from '../types/briefing';

interface HeroBannerProps {
  data: BriefingData;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ data }) => {
  return (
    <div className="relative mb-6">
      {/* Banner Card Container with subtle border and rounded corners */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm bg-white">
        {/* Banner Image with high-fidelity gradient overlay */}
        <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden bg-slate-900">
          <img
            src="/assets/aistudio/Banner_6e63f31b.png"
            alt="Oasis Banner Caribe Cancún"
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          {/* Subtle gradient overlays to ensure extreme readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/10" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/20 to-slate-950/60" />

          {/* Top Date Badge */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Calendar className="w-4 h-4 text-[#1a73e8]" />
            <span className="capitalize">{data.fecha !== 'N/C' ? data.fecha : 'Viernes 28 de agosto del 2026'}</span>
          </div>

          {/* Hotel Mandate Badge (Mandamiento) */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1a73e8]/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Mandamiento del Día
              </div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md font-['Google_Sans',sans-serif]">
                {data.mandamiento !== 'N/C' ? data.mandamiento : 'Mandamiento N°2: "Promover la cultura del detalle con calidad"'}
              </h2>
            </div>
          </div>
        </div>

        {/* Highlight Alert Notice Bar (Sian Ka'an / Café del Mar) */}
        {data.avisoBanner && data.avisoBanner !== 'N/C' && (
          <div className="bg-[#e8f0fe] border-t border-b border-[#d2e3fc] px-4 py-2.5 sm:px-6 flex items-center gap-3 text-xs sm:text-sm text-[#1967d2] font-semibold">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <p className="tracking-wide">
              {data.avisoBanner}
            </p>
          </div>
        )}

        {/* Quick Operations Metrics Bar (Executive summary glance) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-white p-3 sm:p-4">
          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1a73e8] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Ocupación Cierre</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-['Google_Sans',sans-serif]">
                {data.censoCierre.ocupacionPct !== 'N/C' ? data.censoCierre.ocupacionPct : '73.14%'}
              </p>
            </div>
          </div>

          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Huéspedes en Casa</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-['Google_Sans',sans-serif]">
                {data.huespedesEnCasa.total.complejo !== 'N/C' ? data.huespedesEnCasa.total.complejo : '1,742'}
                <span className="text-xs font-normal text-slate-400 ml-1">total</span>
              </p>
            </div>
          </div>

          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Llegadas Complejo</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-['Google_Sans',sans-serif]">
                {data.censoCierre.llegadas !== 'N/C' ? data.censoCierre.llegadas : '118'}
                <span className="text-xs font-normal text-slate-400 ml-1.5">/ {data.censoCierre.salidas !== 'N/C' ? data.censoCierre.salidas : '119'} sal</span>
              </p>
            </div>
          </div>

          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Dólar USD Hotel</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-['Google_Sans',sans-serif]">
                {data.tipoCambio.usd !== 'N/C' ? data.tipoCambio.usd : '$15.13'}
                <span className="text-[11px] font-normal text-slate-500 ml-1">MXN</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
