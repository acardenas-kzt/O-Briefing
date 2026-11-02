import { BriefingData } from '../types/briefing';
import { parseBriefingData, extractCellValueFromMatrix, parseMemberLines } from './briefingParser';
import { DEFAULT_BRIEFING_CSV } from '../data/defaultBriefing';

export interface StoredBriefingRecord {
  id: string;
  title: string;
  dateStr: string;
  monthStr: string; // e.g. "Agosto 2026"
  isToday?: boolean;
  timestamp: number;
  csvContent: string;
  uploaderName?: string;
}

export interface StoredAuditOverride {
  key: string;
  value: string;
  cellCoordinate?: string;
  updatedAt?: number;
}

export type AuditOverridesMap = Record<string, StoredAuditOverride>;

const STORAGE_KEY = 'o_briefing_history_v1';
const ACTIVE_ID_KEY = 'o_briefing_active_id';
export const AUDIT_OVERRIDES_KEY = 'o_briefing_audit_overrides_v2';
export const GLOBAL_CELL_COORDS_KEY = 'o_briefing_global_coords_v2';

export function getInitialRecords(): StoredBriefingRecord[] {
  return [
    {
      id: 'briefing_2026_08_28',
      title: 'Viernes 28 de Agosto, 2026',
      dateStr: '28 de agosto del 2026',
      monthStr: 'Agosto 2026',
      isToday: true,
      timestamp: new Date('2026-08-28T08:00:00').getTime(),
      csvContent: DEFAULT_BRIEFING_CSV,
      uploaderName: 'Lic. Roberto Morales (Recepción)',
    },
    {
      id: 'briefing_2026_08_27',
      title: 'Jueves 27 de Agosto, 2026 (Histórico)',
      dateStr: '27 de agosto del 2026',
      monthStr: 'Agosto 2026',
      isToday: false,
      timestamp: new Date('2026-08-27T08:00:00').getTime(),
      csvContent: DEFAULT_BRIEFING_CSV.replace('viernes 28 de agosto del 2026', 'jueves 27 de agosto del 2026').replace('73.14%', '74.20%'),
      uploaderName: 'Lic. Claudia Reyes (Auditoría Nocturna)',
    },
    {
      id: 'briefing_2026_07_31',
      title: 'Viernes 31 de Julio, 2026 (Cierre de Mes)',
      dateStr: '31 de julio del 2026',
      monthStr: 'Julio 2026',
      isToday: false,
      timestamp: new Date('2026-07-31T08:00:00').getTime(),
      csvContent: DEFAULT_BRIEFING_CSV.replace('viernes 28 de agosto del 2026', 'viernes 31 de julio del 2026').replace('73.14%', '78.50%'),
      uploaderName: 'Lic. Roberto Morales (Recepción)',
    },
  ];
}

export function getStoredRecords(): StoredBriefingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initials = getInitialRecords();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initials));
      return initials;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return getInitialRecords();
  }
}

export function saveStoredRecord(record: StoredBriefingRecord): void {
  try {
    const existing = getStoredRecords();
    const filtered = existing.filter((r) => r.id !== record.id);
    const updated = [record, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_ID_KEY, record.id);
  } catch (err) {
    console.error('Error saving record to localStorage:', err);
  }
}

export function getActiveRecordId(): string {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY) || 'briefing_2026_08_28';
  } catch {
    return 'briefing_2026_08_28';
  }
}

export function setActiveRecordId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch (err) {
    console.error('Error setting active id:', err);
  }
}

/**
 * Retrieves all stored audit overrides for a given briefing record
 */
export function getAuditOverrides(recordId?: string): AuditOverridesMap {
  try {
    const raw = localStorage.getItem(AUDIT_OVERRIDES_KEY);
    if (!raw) return {};
    const all = JSON.parse(raw);
    const recId = recordId || getActiveRecordId();
    return all[recId] || {};
  } catch (err) {
    console.error('Error reading audit overrides:', err);
    return {};
  }
}

/**
 * Saves a single audit adjustment (cell coordinate and/or value) to localStorage
 */
export function saveAuditOverride(
  recordId: string,
  key: string,
  value: string,
  cellCoordinate?: string
): void {
  try {
    const raw = localStorage.getItem(AUDIT_OVERRIDES_KEY);
    const all: Record<string, AuditOverridesMap> = raw ? JSON.parse(raw) : {};
    if (!all[recordId]) {
      all[recordId] = {};
    }
    all[recordId][key] = {
      key,
      value,
      cellCoordinate,
      updatedAt: Date.now(),
    };
    localStorage.setItem(AUDIT_OVERRIDES_KEY, JSON.stringify(all));

    // Also persist globally the coordinate mapping if valid
    if (cellCoordinate && cellCoordinate !== 'N/C' && cellCoordinate !== 'N/A') {
      const rawCoords = localStorage.getItem(GLOBAL_CELL_COORDS_KEY);
      const coords = rawCoords ? JSON.parse(rawCoords) : {};
      coords[key] = cellCoordinate;
      localStorage.setItem(GLOBAL_CELL_COORDS_KEY, JSON.stringify(coords));
    }
  } catch (err) {
    console.error('Error saving audit override to localStorage:', err);
  }
}

/**
 * Reverts a single key's override for a record
 */
export function removeSingleAuditOverride(recordId: string, key: string): void {
  try {
    const raw = localStorage.getItem(AUDIT_OVERRIDES_KEY);
    if (!raw) return;
    const all = JSON.parse(raw);
    if (all[recordId] && all[recordId][key]) {
      delete all[recordId][key];
      localStorage.setItem(AUDIT_OVERRIDES_KEY, JSON.stringify(all));
    }
  } catch (err) {
    console.error('Error removing audit override:', err);
  }
}

/**
 * Clears all audit overrides for a record
 */
export function clearAuditOverrides(recordId?: string): void {
  try {
    const raw = localStorage.getItem(AUDIT_OVERRIDES_KEY);
    if (!raw) return;
    const all = JSON.parse(raw);
    const recId = recordId || getActiveRecordId();
    delete all[recId];
    localStorage.setItem(AUDIT_OVERRIDES_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Error clearing audit overrides:', err);
  }
}

/**
 * Returns true if the record has any audit overrides
 */
export function hasAuditOverrides(recordId?: string): boolean {
  const overrides = getAuditOverrides(recordId);
  return Object.keys(overrides).length > 0;
}

/**
 * Applies saved audit overrides to a parsed BriefingData object
 */
export function applyAuditOverrides(data: BriefingData, recordId: string): BriefingData {
  const overrides = getAuditOverrides(recordId);
  const keys = Object.keys(overrides);
  if (keys.length === 0) return data;

  const updatedInspections = data.cellInspections.map((item) => {
    const ov = overrides[item.key];
    if (ov) {
      const coord = ov.cellCoordinate !== undefined ? ov.cellCoordinate : item.cellCoordinate;
      let val = ov.value;
      if ((!val || val.trim() === '' || val === 'N/C') && coord && coord !== 'N/C' && data.rawMatrix) {
        const extracted = extractCellValueFromMatrix(data.rawMatrix, coord);
        if (extracted && extracted !== 'N/C') {
          val = extracted;
        }
      }
      const isNC = !val || val.trim() === '' || val.trim() === 'N/C';
      return {
        ...item,
        cellCoordinate: coord,
        parsedValue: val,
        status: isNC ? ('NC' as const) : ('FOUND' as const),
        overrideValue: val,
      };
    }
    return item;
  });

  const updatedData: BriefingData = {
    ...data,
    cellInspections: updatedInspections,
    censoCierre: { ...data.censoCierre },
    tipoCambio: { ...data.tipoCambio },
    previsionGOC: { ...data.previsionGOC },
    previsionPYR: { ...data.previsionPYR },
    huespedesEnCasa: {
      adultos: { ...data.huespedesEnCasa.adultos },
      menores: { ...data.huespedesEnCasa.menores },
      total: { ...data.huespedesEnCasa.total },
    },
    sociosOTLC: {
      ...data.sociosOTLC,
      llegando: [...data.sociosOTLC.llegando],
      enCasa: [...data.sociosOTLC.enCasa],
      enCasaCol1: [...(data.sociosOTLC.enCasaCol1 || [])],
      enCasaCol2: [...(data.sociosOTLC.enCasaCol2 || [])],
      nuevos: [...data.sociosOTLC.nuevos],
      saliendo: [...data.sociosOTLC.saliendo],
    },
  };

  keys.forEach((key) => {
    const ov = overrides[key];
    if (!ov) return;
    const value = ov.value;

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
    if (key === 'benef_alg_goc') {
      updatedData.beneficios.algGOC = value
        .split('\n')
        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter((l) => l.length > 2);
    }
    if (key === 'benef_alg_pyr') {
      updatedData.beneficios.algPYR = value
        .split('\n')
        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter((l) => l.length > 2);
    }
  });

  return updatedData;
}

export function getActiveBriefing(): { record: StoredBriefingRecord; data: BriefingData } {
  const records = getStoredRecords();
  const activeId = getActiveRecordId();
  let record = records.find((r) => r.id === activeId) || records[0];

  if (!record) {
    record = getInitialRecords()[0];
  }

  const rawData = parseBriefingData(record.csvContent, record.id);
  const data = applyAuditOverrides(rawData, record.id);
  return { record, data };
}

export function deleteStoredRecord(id: string): { updatedRecords: StoredBriefingRecord[]; newActiveRecord: StoredBriefingRecord } {
  try {
    const existing = getStoredRecords();
    const filtered = existing.filter((r) => r.id !== id);
    const updated = filtered.length > 0 ? filtered : getInitialRecords();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    clearAuditOverrides(id);

    const currentActiveId = getActiveRecordId();
    let newActiveId = currentActiveId;
    if (currentActiveId === id) {
      newActiveId = updated[0].id;
      localStorage.setItem(ACTIVE_ID_KEY, newActiveId);
    }
    const newActiveRecord = updated.find((r) => r.id === newActiveId) || updated[0];
    return { updatedRecords: updated, newActiveRecord };
  } catch (err) {
    console.error('Error deleting record from localStorage:', err);
    return { updatedRecords: getStoredRecords(), newActiveRecord: getInitialRecords()[0] };
  }
}

