import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Utensils, Users, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { BriefingData } from '../../types/briefing';
import { TabId } from '../NavigationTabs';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BriefingData;
  onSelectTab: (tab: TabId) => void;
}

interface SearchResult {
  title: string;
  subtitle: string;
  tab: TabId;
  category: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  data,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle is handled in parent, but this handles inside
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();

  if (q.length > 1) {
    // 1. Check Restaurants
    data.centrosConsumo.forEach((c) => {
      if (c.nombre.toLowerCase().includes(q) || c.observaciones.toLowerCase().includes(q)) {
        results.push({
          title: c.nombre,
          subtitle: `${c.tipo === 'restaurante' ? 'Restaurante' : 'Bar'} • ${c.activo ? 'Abierto' : 'Cerrado'} • ${c.observaciones || 'Centro de consumo'}`,
          tab: 'consumo',
          category: 'Centros de Consumo',
        });
      }
    });

    // 2. Check VIPs
    data.vips.llegando.forEach((v) => {
      if (v.nombre.toLowerCase().includes(q) || (v.habitacion && v.habitacion.toLowerCase().includes(q))) {
        results.push({
          title: v.nombre,
          subtitle: `VIP Llegando • Habitación ${v.habitacion || 'Por asignar'}`,
          tab: 'censo',
          category: 'Huéspedes VIP',
        });
      }
    });

    data.vips.enCasa.forEach((v) => {
      if (v.nombre.toLowerCase().includes(q) || (v.habitacion && v.habitacion.toLowerCase().includes(q))) {
        results.push({
          title: v.nombre,
          subtitle: `VIP En Casa • Habitación ${v.habitacion || ''} • Salida: ${v.fecha || 'N/A'}`,
          tab: 'censo',
          category: 'Huéspedes VIP',
        });
      }
    });

    // 3. Check Events
    data.eventos.hoy.forEach((e) => {
      if (e.nombre.toLowerCase().includes(q) || e.lugar.toLowerCase().includes(q)) {
        results.push({
          title: e.nombre,
          subtitle: `Evento de Hoy • ${e.lugar} • ${e.horario} (${e.pax})`,
          tab: 'eventos',
          category: 'Eventos',
        });
      }
    });

    // 4. Check Services
    data.servicios.generales.forEach((s) => {
      if (s.nombre.toLowerCase().includes(q)) {
        results.push({
          title: s.nombre,
          subtitle: `Servicio General • Horario: ${s.horario}`,
          tab: 'servicios',
          category: 'Servicios',
        });
      }
    });

    data.servicios.tarifas.forEach((st) => {
      if (st.concepto.toLowerCase().includes(q)) {
        results.push({
          title: st.concepto,
          subtitle: `Tarifa de Servicio • Precio: ${st.precio}`,
          tab: 'servicios',
          category: 'Servicios',
        });
      }
    });

    // 5. Check Rates
    data.tarifas.habitaciones.forEach((th) => {
      if (th.categoria.toLowerCase().includes(q) || th.hotel.toLowerCase().includes(q)) {
        results.push({
          title: `${th.categoria} (${th.hotel})`,
          subtitle: `Tarifa 2 Pax: ${th.pax2} • 1 Pax: ${th.pax1}`,
          tab: 'tarifas',
          category: 'Tarifas',
        });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar restaurante, VIP, tarifa, evento o servicio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto">
          {query.trim().length <= 1 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Escribe al menos 2 caracteres para buscar en todas las secciones del O-Briefing.
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No se encontraron coincidencias para "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.slice(0, 15).map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectTab(res.tab);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{res.title}</span>
                      <span className="text-[10px] font-semibold text-[#1967d2] bg-[#e8f0fe] px-2 py-0.2 rounded-md">
                        {res.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">{res.subtitle}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1a73e8] transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pulsa Escape para cerrar</span>
          <span>{results.length} coincidencias encontradas</span>
        </div>
      </div>
    </div>
  );
};
