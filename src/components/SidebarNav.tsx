import React from 'react';
import { TabId } from './NavigationTabs';
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

interface SidebarNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  ncCount: number;
  onOpenUpload: () => void;
  onOpenPrint?: () => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onChangeTab,
  ncCount,
  onOpenUpload,
  onOpenPrint,
}) => {
  const navItems: NavItem[] = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'censo', label: 'Censo', icon: Users },
    { id: 'eventos', label: 'Eventos', icon: CalendarDays },
    { id: 'tarifas', label: 'Tarifas', icon: Receipt },
    { id: 'beneficios', label: 'Beneficios', icon: Gift },
    { id: 'consumo', label: 'Consumo', icon: UtensilsCrossed },
    { id: 'servicios', label: 'Servicios', icon: Briefcase },
    { id: 'interno', label: 'Interno', icon: ShieldCheck },
  ];

  return (
    <nav className="w-full h-full p-5 flex flex-col justify-between select-none overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        {/* Logo Wrap */}
        <div className="pb-4 border-b border-slate-200 mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 p-1.5 shadow-2xs flex items-center justify-center flex-shrink-0">
            <img
              src="/assets/aistudio/LogoOasis_90641185.svg"
              alt="Oasis"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-slate-900 tracking-tight text-base font-['Montserrat',sans-serif] truncate">
              O-Briefing
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block truncate">
              Grand Oasis & Pyr
            </span>
          </div>
        </div>

        {/* Links list */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#0369a1] bg-white shadow-2xs font-extrabold border-l-4 border-[#0369a1]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0369a1]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Stack: Buttons */}
      <div className="pt-4 border-t border-slate-200">
        {/* Imprimir Informe & Cargar Datos */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onOpenPrint || (() => window.print())}
            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-2 px-3 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98"
          >
            <span>Imprimir Informe</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="w-full border-2 border-[#0f172a] hover:bg-slate-100 text-[#0f172a] py-1.5 px-3 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Cargar Datos</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
