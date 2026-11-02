import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  Gift,
  UtensilsCrossed,
  Briefcase,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export type TabId =
  | 'resumen'
  | 'censo'
  | 'eventos'
  | 'tarifas'
  | 'beneficios'
  | 'consumo'
  | 'servicios'
  | 'interno'
  | 'inspector';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavigationTabsProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  ncCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onChangeTab, ncCount }) => {
  const tabs: TabItem[] = [
    { id: 'resumen', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
    { id: 'censo', label: 'Censo y Ocupación', icon: Users },
    { id: 'eventos', label: 'Eventos', icon: CalendarDays },
    { id: 'tarifas', label: 'Tarifas', icon: Receipt },
    { id: 'beneficios', label: 'Beneficios', icon: Gift },
    { id: 'consumo', label: 'Centros de Consumo', icon: UtensilsCrossed },
    { id: 'servicios', label: 'Servicios', icon: Briefcase },
    { id: 'interno', label: 'Interno', icon: ShieldCheck },
  ];

  return (
    <div className="mb-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5 print:hidden">
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Secciones del Briefing">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#1a73e8] text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badge.toString().includes('N/C')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
