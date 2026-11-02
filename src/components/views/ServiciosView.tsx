import React from 'react';
import { Briefcase, Clock, Phone, Sparkles, HeartPulse, UserCheck, ShieldAlert } from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface ServiciosViewProps {
  data: BriefingData;
}

export const ServiciosView: React.FC<ServiciosViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* 1. Servicios Generales (Horarios Operativos) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#1a73e8]" />
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                SERVICIOS GENERALES
              </h3>
              <p className="text-xs text-slate-500">Mesa de hospitalidad, Kids club, Spas, Gimnasio y Albercas</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            Atención al Huésped
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.servicios.generales.map((serv, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  {serv.nombre}
                </span>
                <span className="text-sm font-black text-[#1a73e8] font-['Google_Sans',sans-serif]">
                  {serv.horario}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Tarifas de Servicios y Asistencia Médica */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tarifas de Servicios Adicionales */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
              TARIFAS DE SERVICIOS ADICIONALES
            </h3>
            <p className="text-xs text-slate-500">Tenis, Room Service, Niñera, Late Check Out y Reposición</p>
          </div>

          <div className="divide-y divide-slate-100">
            {data.servicios.tarifas.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="pr-4">
                  <span className="font-bold text-slate-800 block">{item.concepto}</span>
                  {item.notas && <span className="text-[11px] text-slate-500 block">{item.notas}</span>}
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 font-black text-slate-900 flex-shrink-0">
                  {item.precio}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Llamadas Telefónicas y Asistencia Médica */}
        <div className="lg:col-span-5 space-y-6">
          {/* Llamadas telefónicas */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <Phone className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                TARIFAS TELEFÓNICAS DESDE HABITACIÓN
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {data.servicios.llamadas.map((ll, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{ll.tipo}</span>
                  <span className="font-bold text-slate-900">{ll.precio}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Información de Seguridad y Brazalete */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                Políticas de Seguridad en Brazaletes
              </h4>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              En caso de extravío de brazalete todo incluido, se aplicará el cargo reglamentario de{' '}
              <strong>$3,850.00 MXN</strong> por persona en recepción para reposición y revalidación de credencial.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Paquetes y Promociones Especiales de Spa */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] font-['Montserrat',sans-serif]">
                Promociones Especiales de Spa (Aaktun & Kin-Ha)
              </h3>
              <p className="text-xs text-slate-500">Paquetes de relajación y bienestar para huéspedes</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
            Bienestar Oasis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.servicios.spaPromos.map((spa, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/30 via-white to-white flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
                  Paquete Ritual
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-3 font-['Google_Sans',sans-serif]">
                  {spa.nombre}
                </h4>

                <ul className="space-y-1.5 text-xs text-slate-600 mb-4">
                  {spa.incluye.map((inc, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Precio especial:</span>
                <span className="text-sm font-black text-purple-900 font-['Google_Sans',sans-serif]">
                  {spa.precio}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
