import React, { useState } from 'react';
import { Sparkles, Coffee, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface BeneficiosViewProps {
  data: BriefingData;
}

export const BeneficiosView: React.FC<BeneficiosViewProps> = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState<'otlc' | 'alg' | 'minibar'>('otlc');

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('otlc')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCategory === 'otlc'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Socios OTLC (Nuevos vs Anteriores)</span>
        </button>

        <button
          onClick={() => setActiveCategory('alg')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCategory === 'alg'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Huéspedes ALG & Master Suites</span>
        </button>

        <button
          onClick={() => setActiveCategory('minibar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCategory === 'minibar'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Minibar en Habitación</span>
        </button>
      </div>

      {/* 1. OTLC Members */}
      {activeCategory === 'otlc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Socios Nuevos Oasis Leisure Club */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1a73e8]" />
                  <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                    Beneficios Socios Nuevos Oasis Leisure Club
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#e8f0fe] text-[#1967d2]">
                  Nuevas Membresías
                </span>
              </div>

              <ul className="text-xs text-slate-700">
                {data.beneficios.sociosNuevosOTLC.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-2 px-[7px] py-[5px] mb-[5px] last:mb-0 rounded-lg hover:bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-[#1a73e8] shrink-0 mt-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Socios Anteriores OTLC */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                    Beneficios OTLC (Socios Anteriores)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  All Inclusive
                </span>
              </div>

              <ul className="text-xs text-slate-700">
                {data.beneficios.sociosAnterioresOTLC.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-2 px-[7px] py-[5px] mb-[5px] last:mb-0 rounded-lg hover:bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. ALG & PYRMS */}
      {activeCategory === 'alg' && (
        <div className="space-y-6">
          {/* Fila superior: 2/3 para Huéspedes ALG (Grand Oasis y The Pyramid) y 1/3 para Master Suites PYRMS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Contenedor 2/3: Huéspedes ALG */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Beneficios Huéspedes ALG - Grand Oasis */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="pb-3 border-b border-slate-100 mb-4">
                      <h4 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                        Beneficios Huéspedes ALG - Grand Oasis
                      </h4>
                    </div>
                    <ul className="text-xs text-slate-700">
                      {data.beneficios.algGOC.map((ben, idx) => (
                        <li key={idx} className="flex items-start gap-2 px-[7px] py-[5px] mb-[5px] last:mb-0 rounded-lg hover:bg-slate-50">
                          <CheckCircle2 className="w-4 h-4 text-[#1a73e8] shrink-0 mt-0" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Beneficios Huéspedes ALG - The Pyramid */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="pb-3 border-b border-slate-100 mb-4">
                      <h4 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                        Beneficios Huéspedes ALG - The Pyramid
                      </h4>
                    </div>
                    <ul className="text-xs text-slate-700">
                      {data.beneficios.algPYR.map((ben, idx) => (
                        <li key={idx} className="flex items-start gap-2 px-[7px] py-[5px] mb-[5px] last:mb-0 rounded-lg hover:bg-slate-50">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenedor 1/3: Pyramid Master Suites */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-2xl border border-amber-200/80 p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                      Beneficios Pyramid Master Suite (PYRMS)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {data.beneficios.pyrms.map((ben, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/90 border border-amber-200/0 shadow-2xs text-xs font-medium text-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mercado Americano & Tripulaciones (integrado debajo de ALG & Master Suites) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Mercado Americano */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  Beneficios Huéspedes Mercado Americano
                </h3>
              </div>
              <ul className="text-xs text-slate-700">
                {data.beneficios.mercadoAmericano.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-2 px-[7px] py-[5px] mb-[5px] last:mb-0 rounded-lg hover:bg-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tripulación */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  Beneficios Huéspedes Tripulación de Vuelo
                </h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Capitán / Primer Oficial (CPT / FO)</span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {data.beneficios.tripulacionCapitanes.map((b, idx) => (
                      <li key={idx}>• {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Sobrecargos</span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {data.beneficios.tripulacionSobrecargos.map((b, idx) => (
                      <li key={idx}>• {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Minibar */}
      {activeCategory === 'minibar' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                Servicio de Minibar en Habitación
              </h3>
              <p className="text-xs text-slate-500">Extensiones directas: <strong>Ext. 5020 - 5100</strong></p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              Atención Room Service
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-900 block mb-2">Grand Oasis Cancún</span>
              <p className="text-xs text-slate-600 leading-relaxed">{data.beneficios.minibarGOC}</p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30">
              <span className="text-xs font-bold text-amber-900 block mb-2">The Pyramid at Grand Oasis</span>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{data.beneficios.minibarPYR}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
