import React from 'react';
import { Target, Compass, Heart, Award } from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface InternoViewProps {
  data: BriefingData;
}

export const InternoView: React.FC<InternoViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* 1. Misión y Visión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Misión */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a73e8] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Identidad Corporativa</span>
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  Nuestra Misión
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {data.interno.mision}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#1a73e8] font-semibold">
            Oasis Hotels & Resorts • Pasión por el Detalle
          </div>
        </div>

        {/* Visión */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Proyección Futura</span>
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  Nuestra Visión
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {data.interno.vision}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-indigo-600 font-semibold">
            Liderazgo Hotelero en el Caribe Mexicano
          </div>
        </div>
      </div>

      {/* 2. Valores y Mandamientos de Cultura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Valores */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Valores Institucionales
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {data.interno.valores.map((val, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
                <span>{val}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandamientos */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              Cultura del Detalle con Calidad (Mandamientos)
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {data.interno.mandamientosCultura.map((man, idx) => (
              <li
                key={idx}
                className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                  man.includes('N°2')
                    ? 'bg-[#e8f0fe] border-[#c2daf8] text-[#1967d2] font-semibold'
                    : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>{man}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
