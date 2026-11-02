import * as XLSX from 'xlsx';
import { parseBriefingData } from './briefingParser';
import { BriefingData } from '../types/briefing';

/**
 * Transforms a standard Google Sheets sharing URL into a direct CSV export URL
 */
export function normalizeGoogleSheetUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.includes('/export?format=csv') || trimmed.includes('output=csv')) {
    return trimmed;
  }

  // Check for sheet ID e.g. https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid={GID}
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    const gidMatch = trimmed.match(/[#&]gid=([0-9]+)/);
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;
  }

  return trimmed;
}

/**
 * Reads an ArrayBuffer or binary from an Excel file (.xlsx / .xls) and parses it
 */
export function parseExcelFile(data: ArrayBuffer | Uint8Array, filename = 'documento.xlsx'): BriefingData {
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const csvText = XLSX.utils.sheet_to_csv(worksheet);

  // Derive date ID from filename or fallback
  const dateId = filename.replace(/\.[^/.]+$/, '');
  return parseBriefingData(csvText, dateId);
}

/**
 * Fetches Google Sheet CSV directly (via CORS or proxy)
 */
export async function fetchGoogleSheetCSV(url: string): Promise<BriefingData> {
  const exportUrl = normalizeGoogleSheetUrl(url);
  const response = await fetch(exportUrl);
  if (!response.ok) {
    throw new Error(`No se pudo descargar la hoja de cálculo. Código HTTP: ${response.status}. Asegúrate de que la hoja tenga permisos "Cualquier persona con el enlace puede ver" o esté "Publicada en la web como CSV".`);
  }
  const text = await response.text();
  return parseBriefingData(text, 'google-sheet-live');
}
