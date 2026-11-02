import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, Users, Music2, Sparkles, Search, X } from 'lucide-react';
import { BriefingData, EventoItem } from '../../types/briefing';

interface EventosViewProps {
  data: BriefingData;
}

export const EventosView: React.FC<EventosViewProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterEvents = (events: EventoItem[]) => {
    if (!searchTerm.trim()) return events;
    const term = searchTerm.toLowerCase().trim();
    return events.filter(
      (e) =>
        e.nombre.toLowerCase().includes(term) ||
        e.lugar.toLowerCase().includes(term) ||
        e.horario.toLowerCase().includes(term) ||
        e.pax.toLowerCase().includes(term)
    );
  };

  const filterShows = (shows: { show: string; lugar: string; horario: string }[]) => {
    if (!searchTerm.trim()) return shows;
    const term = searchTerm.toLowerCase().trim();
    return shows.filter(
      (s) =>
        s.show.toLowerCase().includes(term) ||
        s.lugar.toLowerCase().includes(term) ||
        s.horario.toLowerCase().includes(term)
    );
  };

  const eventosHoy = filterEvents(data.eventos.hoy || []);
  const eventosManana = filterEvents(data.eventos.manana || []);
  const showsEntretenimiento = filterShows(data.eventos.entretenimiento || []);

  const totalEventosHoy = data.eventos.hoy?.length || 0;
  const totalEventosManana = data.eventos.manana?.length || 0;
  const totalShows = data.eventos.entretenimiento?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="h-auto sm:h-[55px] bg-white rounded-2xl border border-[#ced7dd] shadow-2xs px-4 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm font-['Montserrat',sans-serif]">
            <CalendarDays className="w-5 h-5 text-[#0369a1]" />
            <span>AGENDA DE EVENTOS Y ENTRETENIMIENTO</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              {totalEventosHoy} Hoy
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 font-semibold border border-sky-200">
              {totalEventosManana} Mañana
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
              {totalShows} Shows
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por evento, salón, horario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0369a1]/30 focus:border-[#0369a1] text-slate-800 placeholder-slate-400 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Actividades en 2 secciones en lista + Barra lateral para Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Principal: Actividades de Hoy y Actividades de Mañana (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. SECCIÓN: Actividades de Hoy en forma de lista */}
          <div className="bg-white rounded-2xl border border-[#ced7dd] shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e9f0] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base font-['Montserrat',sans-serif]">
                    Actividades de Hoy
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Eventos programados para la jornada actual
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {eventosHoy.length} {eventosHoy.length === 1 ? 'actividad' : 'actividades'}
              </span>
            </div>

            {/* Lista de actividades de hoy */}
            <div className="space-y-2">
              {eventosHoy.length > 0 ? (
                eventosHoy.map((evento, idx) => (
                  <div
                    key={idx}
                    className="h-[60px] min-h-[60px] px-4 rounded-xl border border-[#e2e9f0] hover:border-emerald-200 bg-white hover:bg-emerald-50/20 transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs group"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-['Montserrat',sans-serif] group-hover:text-emerald-950 transition-colors truncate">
                        {evento.nombre}
                      </h4>
                      <div className="flex items-center gap-x-4 text-xs text-slate-500 truncate mt-0.5">
                        <span className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#0369a1] shrink-0" />
                          <span className="truncate">Lugar: <strong className="text-slate-800">{evento.lugar}</strong></span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-slate-600 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Horario: {evento.horario}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-sky-50 text-[#0369a1] border border-sky-100 flex items-center gap-1.5 shadow-2xs">
                        <Users className="w-3.5 h-3.5" />
                        {evento.pax || 'TBA'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">
                    {searchTerm ? 'No se encontraron actividades de hoy con esa búsqueda.' : 'No hay actividades registradas para hoy.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. SECCIÓN: Actividades de Mañana en forma de lista */}
          <div className="bg-white rounded-2xl border border-[#ced7dd] shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e9f0] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0369a1] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base font-['Montserrat',sans-serif]">
                    Actividades de Mañana
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Previsión y logística para el próximo día
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0369a1] border border-sky-200">
                {eventosManana.length} {eventosManana.length === 1 ? 'actividad' : 'actividades'}
              </span>
            </div>

            {/* Lista de actividades de mañana */}
            <div className="space-y-2">
              {eventosManana.length > 0 ? (
                eventosManana.map((evento, idx) => (
                  <div
                    key={idx}
                    className="h-[60px] min-h-[60px] px-4 rounded-xl border border-[#e2e9f0] hover:border-sky-200 bg-white hover:bg-sky-50/20 transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs group"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-['Montserrat',sans-serif] group-hover:text-[#0369a1] transition-colors truncate">
                        {evento.nombre}
                      </h4>
                      <div className="flex items-center gap-x-4 text-xs text-slate-500 truncate mt-0.5">
                        <span className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">Lugar: <strong className="text-slate-800">{evento.lugar}</strong></span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-slate-600 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Horario: {evento.horario}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                        <Users className="w-3.5 h-3.5" />
                        {evento.pax || 'TBA'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">
                    {searchTerm ? 'No se encontraron actividades de mañana con esa búsqueda.' : 'No hay actividades registradas para mañana.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Lateral (Barra al lado): Shows de Entretenimiento (4 cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-[#ced7dd] shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base font-['Montserrat',sans-serif]">
                    Shows de Entretenimiento
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Cartelera nocturna en vivo
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                {showsEntretenimiento.length}
              </span>
            </div>

            {/* Lista de shows en la barra lateral */}
            <div className="space-y-3">
              {showsEntretenimiento.length > 0 ? (
                showsEntretenimiento.map((show, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-purple-100/90 bg-gradient-to-br from-purple-50/40 via-white to-white flex flex-col justify-between hover:border-purple-300 transition-all shadow-2xs hover:shadow-xs group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/80 border border-purple-200 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Music2 className="w-3 h-3" />
                          En Vivo
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#0369a1] bg-sky-50 border border-sky-200/70 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                          <Clock className="w-3 h-3 text-[#0369a1]" />
                          {show.horario}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-['Montserrat',sans-serif] group-hover:text-purple-950 transition-colors">
                        {show.show}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="font-medium truncate">{show.lugar}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-purple-100/70 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                      <span>Grand Oasis & The Pyramid</span>
                      <span className="text-purple-600 font-semibold">Incluido</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-purple-50/30 rounded-xl border border-dashed border-purple-200">
                  <p className="text-xs text-slate-400 font-medium">
                    {searchTerm ? 'No se encontraron shows con esa búsqueda.' : 'No hay shows programados.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

