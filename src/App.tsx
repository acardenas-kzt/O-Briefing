import React, { useState, useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { MainHeaderBlock } from './components/MainHeaderBlock';
import { TabId } from './components/NavigationTabs';
import { ResumenEjecutivoView } from './components/views/ResumenEjecutivoView';
import { CensoOcupacionView } from './components/views/CensoOcupacionView';
import { EventosView } from './components/views/EventosView';
import { TarifasView } from './components/views/TarifasView';
import { BeneficiosView } from './components/views/BeneficiosView';
import { CentrosConsumoView } from './components/views/CentrosConsumoView';
import { ServiciosView } from './components/views/ServiciosView';
import { InternoView } from './components/views/InternoView';
import { CellInspectorView } from './components/views/CellInspectorView';
import { PasswordUploadModal } from './components/modals/PasswordUploadModal';
import { HistoryModal } from './components/modals/HistoryModal';
import { SearchModal } from './components/modals/SearchModal';
import { AuditoriaPasswordModal } from './components/modals/AuditoriaPasswordModal';
import { PrintSelectionModal } from './components/modals/PrintSelectionModal';
import { isAuditoriaSessionAuthenticated } from './utils/adminSession';
import {
  getActiveBriefing,
  getStoredRecords,
  setActiveRecordId,
  deleteStoredRecord,
  saveAuditOverride,
  clearAuditOverrides,
  removeSingleAuditOverride,
  hasAuditOverrides,
  applyAuditOverrides,
  StoredBriefingRecord,
} from './utils/briefingStorage';
import { BriefingData } from './types/briefing';
import { parseMemberLines } from './utils/briefingParser';
import { Menu, X, Search, Calendar, UploadCloud, Printer, FileSpreadsheet, RotateCw } from 'lucide-react';

export default function App() {
  const [briefingState, setBriefingState] = useState(() => getActiveBriefing());
  const [records, setRecords] = useState<StoredBriefingRecord[]>(() => getStoredRecords());
  const [activeTab, setActiveTab] = useState<TabId>('resumen');

  // Mobile menu drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditoriaOpen, setIsAuditoriaOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected sections for custom print
  const [selectedPrintSections, setSelectedPrintSections] = useState<TabId[]>([
    'resumen',
    'censo',
    'eventos',
    'tarifas',
    'beneficios',
    'consumo',
    'servicios',
    'interno',
  ]);
  const [pageBreakBetweenSections, setPageBreakBetweenSections] = useState(true);

  const activeRecord = briefingState.record;
  const briefingData = briefingState.data;

  const handleConfirmPrint = (sections: TabId[], pageBreak: boolean) => {
    setSelectedPrintSections(sections);
    setPageBreakBetweenSections(pageBreak);
    setIsPrintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = getActiveBriefing();
      setBriefingState(updated);
      setRecords(getStoredRecords());
      setIsRefreshing(false);
    }, 400);
  };

  // Listen for keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectRecord = (selectedRecord: StoredBriefingRecord) => {
    setActiveRecordId(selectedRecord.id);
    const updated = getActiveBriefing();
    setBriefingState(updated);
    setRecords(getStoredRecords());
  };

  const handleBriefingLoaded = (newData: BriefingData, newRecord: StoredBriefingRecord) => {
    const withOverrides = applyAuditOverrides(newData, newRecord.id);
    setBriefingState({ record: newRecord, data: withOverrides });
    setRecords(getStoredRecords());
  };

  const handleDeleteRecord = (recordId: string) => {
    deleteStoredRecord(recordId);
    const updatedRecords = getStoredRecords();
    const currentActive = getActiveBriefing();
    setRecords(updatedRecords);
    setBriefingState(currentActive);
  };

  const handleUpdateOverride = (key: string, value: string, newCoord?: string) => {
    // 1. Persist the override to localStorage so it stays upon page reload
    saveAuditOverride(activeRecord.id, key, value, newCoord);

    // 2. Apply change to current state
    const updatedInspections = briefingData.cellInspections.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          cellCoordinate: newCoord !== undefined ? newCoord : item.cellCoordinate,
          parsedValue: value,
          status: value.trim() === 'N/C' ? ('NC' as const) : ('FOUND' as const),
          overrideValue: value,
        };
      }
      return item;
    });

    const updatedData: BriefingData = {
      ...briefingData,
      cellInspections: updatedInspections,
      censoCierre: { ...briefingData.censoCierre },
      tipoCambio: { ...briefingData.tipoCambio },
      previsionGOC: { ...briefingData.previsionGOC },
      previsionPYR: { ...briefingData.previsionPYR },
    };

    if (key === 'header_fecha') updatedData.fecha = value;
    if (key === 'header_mandamiento') updatedData.mandamiento = value;
    if (key === 'header_aviso') updatedData.avisoBanner = value;
    if (key === 'censo_cierre_fecha') updatedData.censoCierre.fecha = value;
    if (key === 'censo_cierre_ocupacion') updatedData.censoCierre.ocupacionPct = value;
    if (key === 'censo_cierre_llegadas') updatedData.censoCierre.llegadas = value;
    if (key === 'censo_cierre_salidas') updatedData.censoCierre.salidas = value;
    if (key === 'censo_cierre_habitaciones') updatedData.censoCierre.habitaciones = value;
    if (key === 'prev_goc_llegadas') updatedData.previsionGOC.llegadas = value;
    if (key === 'prev_goc_salidas') updatedData.previsionGOC.salidas = value;
    if (key === 'prev_goc_habs') updatedData.previsionGOC.habOcupadas = value;
    if (key === 'prev_pyr_llegadas') updatedData.previsionPYR.llegadas = value;
    if (key === 'prev_pyr_salidas') updatedData.previsionPYR.salidas = value;
    if (key === 'prev_pyr_habs') updatedData.previsionPYR.habOcupadas = value;
    if (key === 'hc_adultos_complejo') updatedData.huespedesEnCasa.adultos.complejo = value;
    if (key === 'hc_adultos_goc') updatedData.huespedesEnCasa.adultos.goc = value;
    if (key === 'hc_adultos_pyr') updatedData.huespedesEnCasa.adultos.pyr = value;
    if (key === 'hc_menores_complejo') updatedData.huespedesEnCasa.menores.complejo = value;
    if (key === 'hc_menores_goc') updatedData.huespedesEnCasa.menores.goc = value;
    if (key === 'hc_menores_pyr') updatedData.huespedesEnCasa.menores.pyr = value;
    if (key === 'hc_total_complejo') updatedData.huespedesEnCasa.total.complejo = value;
    if (key === 'hc_total_goc') updatedData.huespedesEnCasa.total.goc = value;
    if (key === 'hc_total_pyr') updatedData.huespedesEnCasa.total.pyr = value;
    if (key === 'tc_usd') updatedData.tipoCambio.usd = value;
    if (key === 'tc_dof') updatedData.tipoCambio.dof = value;
    if (key === 'tc_cad') updatedData.tipoCambio.cad = value;
    if (key === 'tc_eur') updatedData.tipoCambio.eur = value;
    if (key === 'tc_gbp') updatedData.tipoCambio.gbp = value;
    if (key === 'socios_llegando') {
      updatedData.sociosOTLC.llegando = parseMemberLines(value);
    }
    if (key === 'socios_nuevos') {
      updatedData.sociosOTLC.nuevos = parseMemberLines(value);
    }
    if (key === 'socios_saliendo') {
      updatedData.sociosOTLC.saliendo = parseMemberLines(value);
    }
    if (key === 'socios_en_casa') {
      const parsed1 = parseMemberLines(value);
      updatedData.sociosOTLC.enCasaCol1 = parsed1;
      updatedData.sociosOTLC.enCasa = [...parsed1, ...(updatedData.sociosOTLC.enCasaCol2 || [])];
    }
    if (key === 'socios_en_casa_2') {
      const parsed2 = parseMemberLines(value);
      updatedData.sociosOTLC.enCasaCol2 = parsed2;
      updatedData.sociosOTLC.enCasa = [...(updatedData.sociosOTLC.enCasaCol1 || []), ...parsed2];
    }

    setBriefingState((prev) => ({
      ...prev,
      data: updatedData,
    }));
  };

  const handleResetOverrides = () => {
    clearAuditOverrides(activeRecord.id);
    const refreshed = getActiveBriefing();
    setBriefingState(refreshed);
  };

  const handleRevertSingleOverride = (key: string) => {
    removeSingleAuditOverride(activeRecord.id, key);
    const refreshed = getActiveBriefing();
    setBriefingState(refreshed);
  };

  const ncCount = briefingData.cellInspections.filter((i) => i.status === 'NC').length;

  return (
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col font-['Montserrat',sans-serif] selection:bg-[#0369a1]/20 selection:text-[#0369a1]">
      {/* Mobile Top Header (< lg screens) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            aria-label="Abrir Menú"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
            <img src="/assets/aistudio/LogoOasis_90641185.svg" alt="Oasis" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-slate-900 text-base tracking-tight">O-Briefing</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            title="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-mono text-[11px]"
            title="Historial"
          >
            <Calendar className="w-4 h-4 text-[#0369a1]" />
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="p-1.5 rounded-lg bg-[#0369a1] text-white hover:bg-[#0284c7]"
            title="Cargar Datos"
          >
            <UploadCloud className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            title="Actualizar datos"
          >
            <RotateCw className={`w-4 h-4 text-[#0369a1] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-72 bg-[#f8fafc] h-full shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-2">
                  <img src="/assets/aistudio/LogoOasis_90641185.svg" alt="Oasis" className="w-6 h-6 object-contain" />
                  <span className="font-extrabold text-slate-900 text-sm">O-Briefing</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="space-y-1">
                {(
                  [
                    ['resumen', 'Resumen'],
                    ['censo', 'Censo'],
                    ['eventos', 'Eventos'],
                    ['tarifas', 'Tarifas'],
                    ['beneficios', 'Beneficios'],
                    ['consumo', 'Consumo'],
                    ['servicios', 'Servicios'],
                    ['interno', 'Interno'],
                  ] as [TabId, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                      activeTab === id
                        ? 'text-[#0369a1] bg-white font-extrabold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPrintModalOpen(true);
                }}
                className="w-full bg-[#0f172a] text-white py-2 text-xs font-bold uppercase rounded-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir Informe
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Dedicated Print View Container (Rendered exclusively when printing selected sections) */}
      <div className="hidden print:block w-full bg-white text-slate-900 p-6 print-full-width">
        {/* Executive Header for Print Report */}
        <div className="pb-6 mb-8 border-b-2 border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/assets/aistudio/LogoOasis_90641185.svg" alt="Logo Oasis" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-black text-slate-950 font-['Montserrat',sans-serif]">O-Briefing Oasis Hotels</h1>
              <p className="font-mono text-xs text-slate-600 tracking-wide">
                Grand Oasis Cancún & The Pyramid • Resumen Diario Ejecutivo
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-bold text-slate-950 block">{briefingData.fecha}</span>
            <span className="text-xs text-slate-500 font-medium">Cancún, Quintana Roo</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">
              Reporte de {selectedPrintSections.length} {selectedPrintSections.length === 1 ? 'sección' : 'secciones'}
            </span>
          </div>
        </div>

        {/* Selected Sections for Print */}
        <div className="space-y-10">
          {selectedPrintSections.map((secId, idx) => {
            const sectionTitle =
              secId === 'resumen'
                ? 'Resumen Ejecutivo'
                : secId === 'censo'
                ? 'Censo y Ocupación'
                : secId === 'eventos'
                ? 'Eventos y Entretenimiento'
                : secId === 'tarifas'
                ? 'Tarifas y Paquetes'
                : secId === 'beneficios'
                ? 'Beneficios Exclusivos'
                : secId === 'consumo'
                ? 'Centros de Consumo'
                : secId === 'servicios'
                ? 'Servicios e Instalaciones'
                : secId === 'interno'
                ? 'Identidad y Cultura Interna'
                : secId;

            return (
              <div
                key={secId}
                className={`${pageBreakBetweenSections && idx > 0 ? 'break-before-page pt-6' : ''} page-break-inside-avoid`}
              >
                <div className="pb-2.5 mb-5 border-b-2 border-[#0369a1] flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 font-['Montserrat',sans-serif]">
                    {sectionTitle}
                  </h2>
                  <span className="text-xs font-mono text-slate-500 font-semibold uppercase">
                    Sección {idx + 1} de {selectedPrintSections.length}
                  </span>
                </div>

                <div className="print-section-content">
                  {secId === 'resumen' && <ResumenEjecutivoView data={briefingData} onNavigateToTab={() => {}} />}
                  {secId === 'censo' && <CensoOcupacionView data={briefingData} />}
                  {secId === 'eventos' && <EventosView data={briefingData} />}
                  {secId === 'tarifas' && <TarifasView data={briefingData} />}
                  {secId === 'beneficios' && <BeneficiosView data={briefingData} />}
                  {secId === 'consumo' && <CentrosConsumoView data={briefingData} />}
                  {secId === 'servicios' && <ServiciosView data={briefingData} />}
                  {secId === 'interno' && <InternoView data={briefingData} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Print Document Footer */}
        <div className="mt-14 pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>OASIS HOTELS & RESORTS • DOCUMENTO CONFIDENCIAL PARA USO INTERNO</span>
          <span>Página O-Briefing</span>
        </div>
      </div>

      {/* Dashboard Layout Container (Sidebar Anchored to Left + Expansive Main View) */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] print:hidden">
        {/* Left Column: Sidebar Nav Anclado a la Izquierda con Ancho Específico sin Scrollbar */}
        <div className="hidden lg:block sticky top-0 left-0 h-screen w-[260px] min-w-[260px] max-w-[260px] flex-shrink-0 z-30 border-r border-slate-200 bg-[#f8fafc] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <SidebarNav
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            ncCount={ncCount}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenPrint={() => setIsPrintModalOpen(true)}
          />
        </div>

        {/* Main View */}
        <main className="px-6 lg:px-[50px] pt-6 lg:pt-[40px] pb-5 lg:pb-[20px] overflow-y-auto flex flex-col justify-between print-full-width w-full max-w-[1500px]">
          <div>
            {/* Main Title & Metrics Grid */}
            <MainHeaderBlock
              data={briefingData}
              activeTab={activeTab}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              onOpenSearch={() => setIsSearchOpen(true)}
              currentMonthStr={activeRecord.monthStr}
            />

            {/* Active Section Content */}
            <section className="mt-4 transition-all duration-200">
              {activeTab === 'resumen' && (
                <ResumenEjecutivoView
                  data={briefingData}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'censo' && <CensoOcupacionView data={briefingData} />}

              {activeTab === 'eventos' && <EventosView data={briefingData} />}

              {activeTab === 'tarifas' && <TarifasView data={briefingData} />}

              {activeTab === 'beneficios' && <BeneficiosView data={briefingData} />}

              {activeTab === 'consumo' && <CentrosConsumoView data={briefingData} />}

              {activeTab === 'servicios' && <ServiciosView data={briefingData} />}

              {activeTab === 'interno' && <InternoView data={briefingData} />}

              {activeTab === 'inspector' && (
                <CellInspectorView
                  data={briefingData}
                  onUpdateOverride={handleUpdateOverride}
                  onBackToDashboard={() => setActiveTab('resumen')}
                  onResetOverrides={handleResetOverrides}
                  onRevertSingleOverride={handleRevertSingleOverride}
                  hasCustomOverrides={hasAuditOverrides(activeRecord.id)}
                />
              )}
            </section>
          </div>

          {/* Simple Bottom Copyright / Status */}
          <footer className="mt-10 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono print:hidden">
            <div className="flex items-center gap-2">
              <span>OASIS HOTELS & RESORTS © {new Date().getFullYear()}</span>
              <span>•</span>
              <span className="uppercase tracking-wider">Ver. 2.0.26 • Cancún, Q. Roo</span>
            </div>
            <button
              onClick={() => {
                if (isAuditoriaSessionAuthenticated()) {
                  setActiveTab('inspector');
                } else {
                  setIsAuditoriaOpen(true);
                }
              }}
              className="text-[#0369a1] hover:underline cursor-pointer font-bold"
            >
              Auditoria ({ncCount} N/C)
            </button>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <PasswordUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onBriefingLoaded={handleBriefingLoaded}
        records={records}
        activeId={activeRecord.id}
        onSelectRecord={handleSelectRecord}
        onDeleteRecord={handleDeleteRecord}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={records}
        activeId={activeRecord.id}
        onSelectRecord={handleSelectRecord}
        onDeleteRecord={handleDeleteRecord}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        data={briefingData}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <AuditoriaPasswordModal
        isOpen={isAuditoriaOpen}
        onClose={() => setIsAuditoriaOpen(false)}
        onSuccess={() => setActiveTab('inspector')}
        ncCount={ncCount}
      />

      <PrintSelectionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onConfirmPrint={handleConfirmPrint}
        defaultSections={selectedPrintSections}
      />
    </div>
  );
}
