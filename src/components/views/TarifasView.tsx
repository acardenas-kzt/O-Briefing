import React, { useState } from 'react';
import {
  Receipt,
  BedDouble,
  Umbrella,
  UtensilsCrossed,
  ArrowUpRight,
  Calculator,
  Info,
  Check,
} from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface TarifasViewProps {
  data: BriefingData;
}

export const TarifasView: React.FC<TarifasViewProps> = ({ data }) => {
  const [activeSection, setActiveSection] = useState<'habitaciones' | 'upgrades' | 'beachclub' | 'restaurantes'>('habitaciones');

  // Quick interactive calculator state for reception
  const [calcPax, setCalcPax] = useState<number>(2);
  const [calcType, setCalcType] = useState<string>('goc_ov');

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSection('habitaciones')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'habitaciones'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Habitaciones & Ejecutiva</span>
        </button>

        <button
          onClick={() => setActiveSection('upgrades')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'upgrades'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Upgrades & Day Pass</span>
        </button>

        <button
          onClick={() => setActiveSection('beachclub')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'beachclub'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Umbrella className="w-4 h-4" />
          <span>Renta Beach Club</span>
        </button>

        <button
          onClick={() => setActiveSection('restaurantes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'restaurantes'
              ? 'bg-[#1a73e8] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Restaurantes Gourmet</span>
        </button>
      </div>

      {/* 1. Habitaciones & Ejecutiva */}
      {activeSection === 'habitaciones' && (
        <div className="space-y-6">
          {/* Tarifas de Habitaciones */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  TARIFA DE HABITACIONES (MXN)
                </h3>
                <p className="text-xs text-slate-500">Tarifas por noche según ocupación en Grand Oasis y The Pyramid</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Todo Incluido
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80">
                    <th className="py-2.5 px-3 font-semibold">Categoría</th>
                    <th className="py-2.5 px-3 font-semibold">Hotel</th>
                    <th className="py-2.5 px-3 font-semibold text-center">1 Adulto</th>
                    <th className="py-2.5 px-3 font-semibold text-center">2 Adultos</th>
                    <th className="py-2.5 px-3 font-semibold text-center">3 Adultos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.tarifas.habitaciones.map((tarifa, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">{tarifa.categoria}</td>
                      <td className="py-3 px-3 font-medium text-slate-600">{tarifa.hotel}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{tarifa.pax1}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{tarifa.pax2}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{tarifa.pax3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pax Extra Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Personas Extras (PAX Extra)</span>
                  <p className="text-[11px] text-slate-500">{data.tarifas.reglasPaxExtras}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
                    GOC Adulto: <strong>$2,860.00 MXN</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
                    GOC Menor: <strong>$1,430.00 MXN</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-amber-800">
                    PYR Adulto: <strong>$3,190.00 MXN</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-amber-800">
                    PYR Menor: <strong>$1,595.00 MXN</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarifa Ejecutiva (USD) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  TARIFA EJECUTIVA (USD)
                </h3>
                <p className="text-xs text-slate-500">Tarifas preferenciales para titulares y socios comerciales</p>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Moneda: USD
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80">
                    <th className="py-2.5 px-3 font-semibold">Tipo</th>
                    <th className="py-2.5 px-3 font-semibold text-center" colSpan={3}>Grand Oasis Cancún</th>
                    <th className="py-2.5 px-3 font-semibold text-center" colSpan={3}>The Pyramid</th>
                  </tr>
                  <tr className="bg-slate-100/60 text-slate-500 text-[11px]">
                    <th className="py-1 px-3"></th>
                    <th className="py-1 px-2 text-center">1 PAX</th>
                    <th className="py-1 px-2 text-center">2 PAX</th>
                    <th className="py-1 px-2 text-center">3 PAX</th>
                    <th className="py-1 px-2 text-center">1 PAX</th>
                    <th className="py-1 px-2 text-center">2 PAX</th>
                    <th className="py-1 px-2 text-center">3 PAX</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.tarifas.ejecutiva.map((tarifa, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">{tarifa.tipo}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{tarifa.goc.pax1}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{tarifa.goc.pax2}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{tarifa.goc.pax3}</td>
                      <td className="py-3 px-2 text-center font-bold text-amber-900">{tarifa.pyr.pax1}</td>
                      <td className="py-3 px-2 text-center font-bold text-amber-900">{tarifa.pyr.pax2}</td>
                      <td className="py-3 px-2 text-center font-bold text-amber-900">{tarifa.pyr.pax3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>{data.tarifas.reglasEjecutiva}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Upgrades & Day Pass */}
      {activeSection === 'upgrades' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Precios Up Grade x Noche */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  Precios Up Grade x Noche
                </h3>
                <p className="text-xs text-slate-500">Servicios incluidos para 2 personas por habitación</p>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {data.tarifas.upgrades.map((upg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:border-[#1a73e8]/30 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 block">{upg.categoriaOrigenDestino}</span>
                      <span className="text-[11px] text-slate-400">{upg.seccion}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-black text-slate-900">
                      {upg.precio} MXN
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Precios Day Pass MXN */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                  Precios Day Pass (MXN)
                </h3>
                <p className="text-xs text-slate-500">Pases de día, noche, cancunenses y extensiones de horario</p>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {data.tarifas.dayPass.map((dp, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:border-[#1a73e8]/30 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 block">{dp.concepto}</span>
                      <span className="text-[11px] text-[#1a73e8] font-medium">{dp.categoria}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-black text-slate-900">
                      {dp.precio}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Beach Club */}
      {activeSection === 'beachclub' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                Precios de Renta Beach Club (MXN)
              </h3>
              <p className="text-xs text-slate-500">Camas balinesas, cabañas y parcelas en Cocoa, Café del Mar y Sian Ka'an</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              Sujeto a disponibilidad
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80">
                  <th className="py-2.5 px-3 font-semibold">Concepto / Ubicación</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Socio OTLC</th>
                  <th className="py-2.5 px-3 font-semibold text-center">PYR Master Suite</th>
                  <th className="py-2.5 px-3 font-semibold text-center">The Pyramid</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Grand Oasis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.tarifas.beachClub.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.concepto}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-600">
                      {item.otlc === 'INCLUÍDO' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          <Check className="w-3 h-3" /> Incluido
                        </span>
                      ) : (
                        item.otlc
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-purple-600">
                      {item.pyrms === 'INCLUÍDO' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          <Check className="w-3 h-3" /> Incluido
                        </span>
                      ) : (
                        item.pyrms
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.pyr}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.grand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Restaurantes Gourmet */}
      {activeSection === 'restaurantes' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                Precios de Acceso en Restaurantes de Especialidad
              </h3>
              <p className="text-xs text-slate-500">Tarifas por comensal para centros de consumo gastronómicos premium</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Por persona
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200/80">
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px] tracking-wider text-slate-600 bg-slate-100/70 border-r border-slate-200/60 whitespace-nowrap min-w-[140px]">
                    Categoría
                  </th>
                  {data.tarifas.restaurantesGourmet.map((rest, idx) => (
                    <th
                      key={idx}
                      className="py-2.5 px-3 font-black text-center uppercase tracking-wide text-xs text-slate-900 whitespace-nowrap min-w-[105px]"
                    >
                      {rest.restaurante}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.tarifas.restaurantesGourmet.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 italic">
                      No hay tarifas de restaurantes disponibles
                    </td>
                  </tr>
                ) : (
                  [
                    { key: 'piramide' as const, label: 'The Pyramid' },
                    { key: 'grandOasis' as const, label: 'Grand Oasis' },
                    { key: 'otrosOasis' as const, label: 'Otros Oasis' },
                    { key: 'externos' as const, label: 'Externos' },
                    { key: 'vip' as const, label: 'Tarifa VIP' },
                    { key: 'sianKaan' as const, label: "Sian Ka'an" },
                  ].map((cat, rowIdx) => {
                    const isEvenRow = rowIdx % 2 === 1; // 1st row (idx 0, impar) => #FFFFFF, 2nd row (idx 1, par) => #F8FAFC
                    return (
                      <tr
                        key={cat.key}
                        className={`transition-colors hover:bg-slate-100/60 ${
                          isEvenRow ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'
                        }`}
                      >
                        <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap border-r border-slate-100">
                          {cat.label}
                        </td>
                        {data.tarifas.restaurantesGourmet.map((rest, idx) => {
                          const val = rest[cat.key];
                          const isIncluido = val?.toLowerCase().includes('inclu');
                          return (
                            <td
                              key={idx}
                              className={`py-3 px-3 text-center whitespace-nowrap text-xs font-semibold ${
                                isIncluido
                                  ? 'text-emerald-700 font-bold'
                                  : cat.key === 'externos'
                                  ? 'text-rose-700 font-bold'
                                  : cat.key === 'vip'
                                  ? 'text-purple-700 font-bold'
                                  : 'text-slate-800'
                              }`}
                            >
                              {val || '-'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
