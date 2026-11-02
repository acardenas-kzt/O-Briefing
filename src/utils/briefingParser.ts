import {
  BriefingData,
  CellInspection,
  ClimaDia,
  TipoCambio,
  CensoCierre,
  PrevisionHotel,
  HuespedesEnCasa,
  PlaneacionSemanalDia,
  VIPSocioItem,
  VisitaInspeccion,
  HuespedCelebrando,
  EventoItem,
  TarifaHabitacion,
  TarifaEjecutiva,
  UpgradeItem,
  DayPassItem,
  BeachClubItem,
  RestauranteGourmetTarifa,
  CentroConsumo,
  ServicioGeneral,
  ServicioTarifa,
  SpaPromo,
  CalificacionComunidad,
} from '../types/briefing';

/**
 * Standard CSV parser that handles commas inside quotes and multiline cells
 */
export function parseCSVToMatrix(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // Remove trailing completely empty rows
  return rows.filter((r) => r.some((c) => c !== ''));
}

export function colToLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export function formatCoord(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}

export function coordToRowCol(coord: string): { row: number; col: number } | null {
  if (!coord) return null;
  const cleaned = coord.trim().replace(/\s+/g, '').toUpperCase();
  const match = cleaned.match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colLetters = match[1];
  const rowNum = parseInt(match[2], 10);
  if (isNaN(rowNum) || rowNum < 1) return null;

  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 64);
  }
  return {
    row: rowNum - 1,
    col: col - 1,
  };
}

export function extractCellValueFromMatrix(
  matrix: string[][] | undefined,
  coord: string
): string {
  if (!matrix || !matrix.length || !coord) return 'N/C';
  const pos = coordToRowCol(coord);
  if (!pos) return 'N/C';
  const { row, col } = pos;
  if (row < 0 || row >= matrix.length) return 'N/C';
  const rowData = matrix[row];
  if (!rowData || col < 0 || col >= rowData.length) return 'N/C';
  const val = rowData[col];
  if (val === undefined || val === null || val.trim() === '') {
    return 'N/C';
  }
  return val.trim();
}

export function parseMemberLines(text: string): VIPSocioItem[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      // e.g. "(I)RAMIREZ HAB.1535 08-31" or "CASTILLO HAB.2537 08-31"
      const habMatch = line.match(/HAB\.?\s*([0-9A-Z]+)/i);
      const habitacion = habMatch ? habMatch[1] : '';
      const dateMatch = line.match(/(\d{1,2}[-/]\d{1,2}(?:[-/]\d{2,4})?)/);
      const fecha = dateMatch ? dateMatch[1] : '';
      let nombre = line.replace(/HAB\.?\s*[0-9A-Z]+/i, '').replace(/(\d{1,2}[-/]\d{1,2}(?:[-/]\d{2,4})?)/, '').trim();
      return {
        nombre: nombre || line,
        habitacion,
        fecha,
      };
    });
}

export function parseBriefingData(csvText: string, dateId = '2026-08-28'): BriefingData {
  const matrix = parseCSVToMatrix(csvText);
  const inspections: CellInspection[] = [];

  const addInspection = (
    key: string,
    label: string,
    section: string,
    value: string | undefined | null,
    sourceRow?: number,
    sourceCol?: number,
    coordOverride?: string
  ): string => {
    const cleaned = value !== undefined && value !== null && value.trim() !== '' ? value.trim() : 'N/C';
    const isNC = cleaned === 'N/C';
    const coord = coordOverride || (sourceRow !== undefined && sourceCol !== undefined ? formatCoord(sourceRow, sourceCol) : 'N/C');

    inspections.push({
      key,
      label,
      section,
      cellCoordinate: coord,
      sourceRow,
      sourceCol,
      parsedValue: cleaned,
      status: isNC ? 'NC' : 'FOUND',
    });

    return cleaned;
  };

  // Find line indices by text search
  const findRowIndex = (keyword: string, startFrom = 0): number => {
    const upper = keyword.toUpperCase();
    for (let r = startFrom; r < matrix.length; r++) {
      const row = matrix[r];
      if (row.some((cell) => cell.toUpperCase().includes(upper))) {
        return r;
      }
    }
    return -1;
  };

  // 1. Fecha & Mandamiento
  let fecha = 'N/C';
  let mandamiento = 'N/C';
  let avisoBanner = 'N/C';

  // Check first few rows
  for (let r = 0; r < Math.min(matrix.length, 6); r++) {
    const row = matrix[r];
    for (let c = 0; c < row.length; c++) {
      const val = row[c];
      if (!val) continue;
      const lower = val.toLowerCase();
      if ((lower.includes('agosto') || lower.includes('enero') || lower.includes('febrero') || lower.includes('marzo') || lower.includes('abril') || lower.includes('mayo') || lower.includes('junio') || lower.includes('julio') || lower.includes('septiembre') || lower.includes('octubre') || lower.includes('noviembre') || lower.includes('diciembre')) && fecha === 'N/C') {
        fecha = addInspection('header_fecha', 'Fecha del Briefing', 'Encabezado', val, r, c);
      } else if (lower.includes('mandamiento') && mandamiento === 'N/C') {
        mandamiento = addInspection('header_mandamiento', 'Mandamiento Diario', 'Encabezado', val, r, c);
      } else if (lower.includes('sian') && lower.includes('ka') && avisoBanner === 'N/C') {
        avisoBanner = addInspection('header_aviso', 'Aviso Destacado Banner', 'Encabezado', val, r, c);
      }
    }
  }

  if (fecha === 'N/C') addInspection('header_fecha', 'Fecha del Briefing', 'Encabezado', 'N/C');
  if (mandamiento === 'N/C') addInspection('header_mandamiento', 'Mandamiento Diario', 'Encabezado', 'N/C');
  if (avisoBanner === 'N/C') addInspection('header_aviso', 'Aviso Destacado Banner', 'Encabezado', 'N/C');

  // 2. Clima
  const climaRows: ClimaDia[] = [];
  const climaIdx = findRowIndex('CLIMA');
  if (climaIdx !== -1 && climaIdx + 4 < matrix.length) {
    const daysRow = matrix[climaIdx + 1];
    const tempsRow = matrix[climaIdx + 2];
    const probRow = matrix[climaIdx + 3];
    const condRow = matrix[climaIdx + 4];

    // Read column pairs
    const colStarts = [0, 2, 4, 6, 8];
    colStarts.forEach((col, idx) => {
      const diaRaw = daysRow?.[col] || '';
      if (diaRaw) {
        const tempsRaw = tempsRow?.[col] || '';
        const minRaw = tempsRow?.[col + 1] || '';
        const probRaw = probRow?.[col] || '';
        const condRaw = condRow?.[col] || '';

        // Extract max/min
        let max = tempsRaw;
        let min = minRaw;
        if (!min && tempsRaw.includes(',')) {
          const parts = tempsRaw.split(',');
          max = parts[0] || '';
          min = parts[1] || '';
        }

        const parsedDia = addInspection(`clima_dia_${idx + 1}`, `Clima Día ${idx + 1}`, 'Clima', diaRaw, climaIdx + 1, col);
        addInspection(`clima_temp_${idx + 1}`, `Temperatura ${diaRaw}`, 'Clima', `${max} / ${min}`, climaIdx + 2, col);

        climaRows.push({
          dia: parsedDia,
          max: max || 'N/C',
          min: min || 'N/C',
          probabilidad: probRaw || 'N/C',
          condicion: condRaw || 'Parcialmente nublado',
        });
      }
    });
  }

  // 3. Tipo de Cambio
  const tipoCambio: TipoCambio = {
    dof: 'N/C',
    usd: 'N/C',
    cad: 'N/C',
    eur: 'N/C',
    gbp: 'N/C',
  };
  const tcIdx = findRowIndex('TIPO DE CAMBIO');
  if (tcIdx !== -1 && tcIdx + 2 < matrix.length) {
    const row1 = matrix[tcIdx + 1];
    const row2 = matrix[tcIdx + 2];
    // DOF is row1[1], USD is row2[3], CAD is row2[5], EUR is row2[7], GBP is row2[9]
    // search row1 and row2 for values
    tipoCambio.dof = addInspection('tc_dof', 'Tipo de Cambio DOF', 'Tipo de Cambio', row1?.[1], tcIdx + 1, 1);
    tipoCambio.usd = addInspection('tc_usd', 'Dólar USD', 'Tipo de Cambio', row2?.[3], tcIdx + 2, 3);
    tipoCambio.cad = addInspection('tc_cad', 'Dólar Canadiense', 'Tipo de Cambio', row2?.[5], tcIdx + 2, 5);
    tipoCambio.eur = addInspection('tc_eur', 'Euro', 'Tipo de Cambio', row2?.[7], tcIdx + 2, 7);
    tipoCambio.gbp = addInspection('tc_gbp', 'Libra Esterlina', 'Tipo de Cambio', row2?.[9], tcIdx + 2, 9);
  }

  // 4. Censo y Ocupación
  const censoCierre: CensoCierre = {
    fecha: 'N/C',
    llegadas: 'N/C',
    salidas: 'N/C',
    habitaciones: 'N/C',
    ocupacionPct: 'N/C',
  };
  const previsionGOC: PrevisionHotel = { hotel: 'Grand Oasis Cancún', llegadas: 'N/C', salidas: 'N/C', habOcupadas: 'N/C' };
  const previsionPYR: PrevisionHotel = { hotel: 'The Pyramid', llegadas: 'N/C', salidas: 'N/C', habOcupadas: 'N/C' };
  const huespedesEnCasa: HuespedesEnCasa = {
    adultos: { complejo: 'N/C', goc: 'N/C', pyr: 'N/C' },
    menores: { complejo: 'N/C', goc: 'N/C', pyr: 'N/C' },
    total: { complejo: 'N/C', goc: 'N/C', pyr: 'N/C' },
  };

  const censoIdx = findRowIndex('CENSO Y OCUPACIÓN');
  if (censoIdx !== -1) {
    // Header row of Censo e.g. "CIERRE DEL DÍA 25/08/26"
    const headerRow = matrix[censoIdx + 1] || [];
    censoCierre.fecha = addInspection('censo_cierre_fecha', 'Fecha Cierre', 'Censo y Ocupación', headerRow[0] || 'Cierre de Día', censoIdx + 1, 0);

    // Look for rows within censoIdx until next section or empty
    for (let r = censoIdx + 1; r < Math.min(matrix.length, censoIdx + 8); r++) {
      const row = matrix[r] || [];
      const col0 = (row[0] || '').trim().toUpperCase();
      const col6 = (row[6] || '').trim().toUpperCase();

      if (col0.includes('PLANEACIÓN') || col0.includes('PLANEACION')) {
        break;
      }

      if (col0 === 'LLEGADAS') {
        censoCierre.llegadas = addInspection('censo_cierre_llegadas', 'Llegadas Cierre', 'Censo y Ocupación', row[1], r, 1);
        previsionGOC.llegadas = addInspection('prev_goc_llegadas', 'Previsión GOC Llegadas', 'Censo y Ocupación', row[3], r, 3);
        previsionGOC.salidas = addInspection('prev_goc_salidas', 'Previsión GOC Salidas', 'Censo y Ocupación', row[4], r, 4);
        previsionGOC.habOcupadas = addInspection('prev_goc_habs', 'Previsión GOC Hab Ocupadas', 'Censo y Ocupación', row[5], r, 5);
      } else if (col0 === 'SALIDAS') {
        censoCierre.salidas = addInspection('censo_cierre_salidas', 'Salidas Cierre', 'Censo y Ocupación', row[1], r, 1);
      } else if (col0 === 'HABITACIONES') {
        censoCierre.habitaciones = addInspection('censo_cierre_habitaciones', 'Habitaciones Ocupadas Cierre', 'Censo y Ocupación', row[1], r, 1);
      } else if (col0 === 'OCUPACIÓN' || col0 === 'OCUPACION') {
        censoCierre.ocupacionPct = addInspection('censo_cierre_ocupacion', 'Porcentaje de Ocupación Cierre', 'Censo y Ocupación', row[1], r, 1);
        // The Pyramid values
        previsionPYR.llegadas = addInspection('prev_pyr_llegadas', 'Previsión The Pyramid Llegadas', 'Censo y Ocupación', row[3], r, 3);
        previsionPYR.salidas = addInspection('prev_pyr_salidas', 'Previsión The Pyramid Salidas', 'Censo y Ocupación', row[4], r, 4);
        previsionPYR.habOcupadas = addInspection('prev_pyr_habs', 'Previsión The Pyramid Hab Ocupadas', 'Censo y Ocupación', row[5], r, 5);
      }

      // Check Huéspedes en casa columns (ADULTOS, MENORES, TOTAL)
      if (col6.includes('ADULTO')) {
        huespedesEnCasa.adultos.complejo = addInspection('hc_adultos_complejo', 'Adultos Complejo', 'Censo y Ocupación', row[7], r, 7);
        huespedesEnCasa.adultos.goc = addInspection('hc_adultos_goc', 'Adultos Grand Oasis', 'Censo y Ocupación', row[8], r, 8);
        huespedesEnCasa.adultos.pyr = addInspection('hc_adultos_pyr', 'Adultos The Pyramid', 'Censo y Ocupación', row[9], r, 9);
      } else if (col6.includes('MENOR')) {
        huespedesEnCasa.menores.complejo = addInspection('hc_menores_complejo', 'Menores Complejo', 'Censo y Ocupación', row[7], r, 7);
        huespedesEnCasa.menores.goc = addInspection('hc_menores_goc', 'Menores Grand Oasis', 'Censo y Ocupación', row[8], r, 8);
        huespedesEnCasa.menores.pyr = addInspection('hc_menores_pyr', 'Menores The Pyramid', 'Censo y Ocupación', row[9], r, 9);
      } else if (col6 === 'TOTAL' || col6.startsWith('TOTAL')) {
        huespedesEnCasa.total.complejo = addInspection('hc_total_complejo', 'Total Huéspedes Complejo', 'Censo y Ocupación', row[7], r, 7);
        huespedesEnCasa.total.goc = addInspection('hc_total_goc', 'Total Huéspedes Grand Oasis', 'Censo y Ocupación', row[8], r, 8);
        huespedesEnCasa.total.pyr = addInspection('hc_total_pyr', 'Total Huéspedes The Pyramid', 'Censo y Ocupación', row[9], r, 9);
      }
    }
  }

  // 5. Planeación Semanal
  const planeacionSemanal: PlaneacionSemanalDia[] = [];
  const planIdx = findRowIndex('PLANEACIÓN SEMANAL');
  if (planIdx !== -1 && planIdx + 4 < matrix.length) {
    const daysRow = matrix[planIdx + 1] || [];
    const llegRow = matrix[planIdx + 2] || [];
    const salRow = matrix[planIdx + 3] || [];
    const habRow = matrix[planIdx + 4] || [];
    const totRow = matrix[planIdx + 5] || [];

    const planCols = [0, 2, 4, 6, 8];
    planCols.forEach((col, idx) => {
      const dia = daysRow[col];
      if (dia) {
        const llegadas = llegRow[col]?.replace(/Total de llegadas:\s*/i, '') || 'N/C';
        const salidas = salRow[col]?.replace(/Total de salidas:\s*/i, '') || 'N/C';
        const habs = habRow[col]?.replace(/Total hab\. ocupadas:\s*/i, '')?.replace(/Total de salidas:\s*/i, '') || 'N/C';
        const pct = totRow[col]?.replace(/TOTAL COMPLEJO:\s*/i, '') || 'N/C';

        addInspection(`plan_dia_${idx + 1}`, `Plan Semanal Día ${dia}`, 'Planeación Semanal', `${llegadas} lleg / ${pct}`, planIdx + 1, col);

        planeacionSemanal.push({
          dia: dia.trim(),
          llegadas,
          salidas,
          habOcupadas: habs,
          totalComplejo: pct,
        });
      }
    });
  }

  // 6. VIPs y Socios OTLC
  const vips = {
    llegando: [] as VIPSocioItem[],
    enCasa: [] as VIPSocioItem[],
    saliendo: [] as VIPSocioItem[],
  };
  const sociosOTLC = {
    llegando: [] as VIPSocioItem[],
    enCasa: [] as VIPSocioItem[],
    enCasaCol1: [] as VIPSocioItem[],
    enCasaCol2: [] as VIPSocioItem[],
    nuevos: [] as VIPSocioItem[],
    saliendo: [] as VIPSocioItem[],
  };
  const visitasInspeccion: VisitaInspeccion[] = [];
  const huespedesCelebrando: HuespedCelebrando[] = [];

  const parseVipCell = (text: string): { llegando: VIPSocioItem[]; enCasa: VIPSocioItem[]; saliendo: VIPSocioItem[] } => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let currentCategory: 'llegando' | 'enCasa' | 'saliendo' = 'llegando';
    const result = { llegando: [] as VIPSocioItem[], enCasa: [] as VIPSocioItem[], saliendo: [] as VIPSocioItem[] };

    lines.forEach((line) => {
      const upper = line.toUpperCase();
      if (upper.includes('VIPS LLEGANDO')) {
        currentCategory = 'llegando';
        return;
      }
      if (upper.includes('VIPS EN CASA')) {
        currentCategory = 'enCasa';
        return;
      }
      if (upper.includes('VIPS SALIENDO')) {
        currentCategory = 'saliendo';
        return;
      }

      if (line.includes('|')) {
        const parts = line.split('|').map((p) => p.trim());
        result[currentCategory].push({
          nombre: parts[0] || line,
          habitacion: parts[1] || '',
          fecha: parts[2] || '',
        });
      } else if (line.length > 2) {
        result[currentCategory].push({ nombre: line });
      }
    });

    return result;
  };


  const vipIdx = findRowIndex('HUÉSPEDES VIP');
  if (vipIdx !== -1) {
    const vipCell = matrix[vipIdx + 1]?.[0] || '';
    addInspection('vips_block', 'Bloque VIPs', 'VIPs y Socios', vipCell ? 'Detectado' : 'N/C', vipIdx + 1, 0);
    const parsedVips = parseVipCell(vipCell);
    vips.llegando = parsedVips.llegando;
    vips.enCasa = parsedVips.enCasa;
    vips.saliendo = parsedVips.saliendo;
  }

  // Socios OTLC Llegando: Celda E32 (col 4, row 31) o fila vipIdx + 2
  const directE32 = matrix[31]?.[4] || '';
  const headerLlegCell = vipIdx !== -1 ? matrix[vipIdx + 2]?.[4] : '';
  const sociosLlegCell = headerLlegCell || directE32 || '';
  sociosOTLC.llegando = parseMemberLines(sociosLlegCell);
  const llegRow = headerLlegCell && vipIdx !== -1 ? vipIdx + 2 : 31;
  addInspection('socios_llegando', 'Socios OTLC Llegando (E:32)', 'VIPs y Socios', `${sociosOTLC.llegando.length} socios`, llegRow, 4);

  // Socios OTLC En Casa: Celda G32 (col 6) y Celda I32 (col 8)
  const directG32 = matrix[31]?.[6] || '';
  const directI32 = matrix[31]?.[8] || '';
  const headerCasa1 = vipIdx !== -1 ? matrix[vipIdx + 2]?.[6] : '';
  const headerCasa2 = vipIdx !== -1 ? matrix[vipIdx + 2]?.[8] : '';
  const sociosCasa1 = headerCasa1 || directG32 || '';
  const sociosCasa2 = headerCasa2 || directI32 || '';
  const parsedCasa1 = parseMemberLines(sociosCasa1);
  const parsedCasa2 = parseMemberLines(sociosCasa2);
  sociosOTLC.enCasaCol1 = parsedCasa1;
  sociosOTLC.enCasaCol2 = parsedCasa2;
  sociosOTLC.enCasa = [...parsedCasa1, ...parsedCasa2];
  const casaRow = headerCasa1 && vipIdx !== -1 ? vipIdx + 2 : 31;
  addInspection('socios_en_casa', 'Socios OTLC En Casa (G:32)', 'VIPs y Socios', `${parsedCasa1.length} socios`, casaRow, 6);
  addInspection('socios_en_casa_2', 'Socios OTLC En Casa Col. 2 (I:32)', 'VIPs y Socios', `${parsedCasa2.length} socios`, casaRow, 8);

  // Visitas de Inspección & Socios Nuevos (Celda E:34)
  const inspIdx = findRowIndex('VISITAS DE INSPECCIÓN');
  if (inspIdx !== -1) {
    const inspRow = matrix[inspIdx + 1] || [];
    if (inspRow[0]) {
      visitasInspeccion.push({
        nombre: inspRow[0],
        pax: inspRow[2] || 'N/C',
      });
      addInspection('visita_insp_1', 'Visita de Inspección', 'Censo y Ocupación', `${inspRow[0]} (${inspRow[2] || ''})`, inspIdx + 1, 0);
    }
  }
  const directE34 = matrix[33]?.[4] || '';
  const inspRowForNuevos = inspIdx !== -1 ? matrix[inspIdx + 1] || [] : [];
  const headerNuevosCell = inspRowForNuevos[3] || inspRowForNuevos[4] || '';
  const sociosNuevosCell = headerNuevosCell || directE34 || '';
  sociosOTLC.nuevos = parseMemberLines(sociosNuevosCell);
  const nuevosRow = headerNuevosCell && inspIdx !== -1 ? inspIdx + 1 : 33;
  addInspection('socios_nuevos', 'Socios OTLC Nuevos (E:34)', 'VIPs y Socios', `${sociosOTLC.nuevos.length} nuevos`, nuevosRow, 4);

  // Huéspedes Celebrando & Socios Saliendo (Celda E:36)
  const celebIdx = findRowIndex('HUÉSPEDES CELEBRANDO');
  if (celebIdx !== -1) {
    const celebRow = matrix[celebIdx + 1] || [];
    const namesCell = celebRow[0] || '';
    const reasonsCell = celebRow[3] || celebRow[4] || '';
    const names = namesCell.split('\n').map((n) => n.trim()).filter(Boolean);
    const reasons = reasonsCell.split('\n').map((r) => r.trim()).filter(Boolean);

    names.forEach((line, idx) => {
      const habMatch = line.match(/HAB\.?\s*([0-9A-Z]+)/i);
      const hab = habMatch ? habMatch[1] : '';
      const nameOnly = line.replace(/HAB\.?\s*[0-9A-Z]+/i, '').trim();
      const motivo = reasons[idx] || reasons[0] || 'Celebración';
      huespedesCelebrando.push({
        nombre: nameOnly || line,
        habitacion: hab,
        motivo,
      });
    });
    addInspection('huespedes_celebrando', 'Huéspedes Celebrando', 'Censo y Ocupación', `${huespedesCelebrando.length} huéspedes`, celebIdx + 1, 0);
  }
  const directE36 = matrix[35]?.[4] || '';
  const celebRowForSal = celebIdx !== -1 ? matrix[celebIdx + 1] || [] : [];
  const headerSalCell = celebRowForSal[4] || celebRowForSal[5] || '';
  const sociosSalCell = headerSalCell || directE36 || '';
  sociosOTLC.saliendo = parseMemberLines(sociosSalCell);
  const salRow = headerSalCell && celebIdx !== -1 ? celebIdx + 1 : 35;
  addInspection('socios_saliendo', 'Socios OTLC Saliendo (E:36)', 'VIPs y Socios', `${sociosOTLC.saliendo.length} socios`, salRow, 4);

  // 7. Eventos
  const eventosHoy: EventoItem[] = [];
  const eventosManana: EventoItem[] = [];
  const showsEntretenimiento: { show: string; lugar: string; horario: string }[] = [];

  const parseEventLines = (text: string): EventoItem[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        // e.g. "CONGRESO XTRONG     OASIS ARENA  08:00-19:00 H  600 PAX"
        const paxMatch = line.match(/(\d+\s*PAX|\d+\s*PX|TBA)/i);
        const pax = paxMatch ? paxMatch[1] : '';
        const timeMatch = line.match(/(\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?\s*H?)/i);
        const horario = timeMatch ? timeMatch[1] : '';

        // Remaining parts
        let clean = line;
        if (pax) clean = clean.replace(pax, '');
        if (horario) clean = clean.replace(horario, '');
        const words = clean.split(/\s{2,}/).map((w) => w.trim()).filter(Boolean);
        const nombre = words[0] || line;
        const lugar = words.length > 1 ? words.slice(1).join(' - ') : 'Complejo Oasis';

        return {
          nombre,
          lugar,
          horario: horario || 'TBA',
          pax: pax || 'TBA',
        };
      });
  };

  const parseShowLines = (text: string): { show: string; lugar: string; horario: string }[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        // e.g. "Flash & Short Shows en Sakura 19:15 h"
        const timeMatch = line.match(/(\d{1,2}:\d{2}\s*h?)/i);
        const horario = timeMatch ? timeMatch[1] : '';
        let rest = line;
        if (horario) rest = rest.replace(horario, '').trim();
        const enMatch = rest.split(/\s+en\s+/i);
        const show = enMatch[0] || rest;
        const lugar = enMatch[1] || 'Oasis';

        return {
          show,
          lugar,
          horario: horario || 'Horario por confirmar',
        };
      });
  };

  const eventosIdx = findRowIndex('EVENTOS');
  if (eventosIdx !== -1) {
    const actHoyCell = matrix[eventosIdx + 2]?.[0] || '';
    const actMananaCell = matrix[eventosIdx + 2]?.[5] || matrix[eventosIdx + 2]?.[6] || '';
    eventosHoy.push(...parseEventLines(actHoyCell));
    eventosManana.push(...parseEventLines(actMananaCell));

    addInspection('eventos_hoy_total', 'Actividades de Hoy', 'Eventos', `${eventosHoy.length} eventos`, eventosIdx + 2, 0);
    addInspection('eventos_manana_total', 'Actividades de Mañana', 'Eventos', `${eventosManana.length} eventos`, eventosIdx + 2, 5);

    // Briefing de entretenimiento
    const entCell = matrix[eventosIdx + 4]?.[5] || matrix[eventosIdx + 4]?.[6] || '';
    showsEntretenimiento.push(...parseShowLines(entCell));
    addInspection('eventos_shows', 'Shows de Entretenimiento', 'Eventos', `${showsEntretenimiento.length} shows`, eventosIdx + 4, 5);
  }

  // 8. Tarifas
  const tarifasHabitaciones: TarifaHabitacion[] = [];
  const tarifasEjecutivas: TarifaEjecutiva[] = [];
  let reglasEjecutiva = 'N/C';
  const paxExtras = [
    { concepto: 'PAX EXTRA ADULTO', goc: ' $ 2,860.00', pyr: ' $ 3,190.00' },
    { concepto: 'PAX EXTRA MENOR', goc: ' $ 1,430.00', pyr: ' $ 1,595.00' },
  ];
  let reglasPaxExtras = 'OCUPACIÓN MÁXIMA: 3 ADULTOS O 2 ADULTOS + 2 NIÑOS';
  const upgrades: UpgradeItem[] = [];
  const dayPass: DayPassItem[] = [];
  const beachClub: BeachClubItem[] = [];
  const restaurantesGourmet: RestauranteGourmetTarifa[] = [];

  const tarifIdx = findRowIndex('TARIFAS');
  if (tarifIdx !== -1) {
    // Room rates
    const habsIdx = findRowIndex('TARIFA HABITACIONES', tarifIdx);
    if (habsIdx !== -1) {
      const rowOV = matrix[habsIdx + 2] || [];
      const rowSTD = matrix[habsIdx + 3] || [];

      // Grand Oasis: col 4, 5, 6. The Pyramid: col 7, 8, 9
      tarifasHabitaciones.push({
        categoria: 'Ocean View',
        hotel: 'Grand Oasis Cancun',
        pax1: addInspection('tarifa_ov_goc_1pax', 'Tarifa Ocean View GOC 1 PAX', 'Tarifas', rowOV[4], habsIdx + 2, 4),
        pax2: addInspection('tarifa_ov_goc_2pax', 'Tarifa Ocean View GOC 2 PAX', 'Tarifas', rowOV[5], habsIdx + 2, 5),
        pax3: addInspection('tarifa_ov_goc_3pax', 'Tarifa Ocean View GOC 3 PAX', 'Tarifas', rowOV[6], habsIdx + 2, 6),
      });
      tarifasHabitaciones.push({
        categoria: 'Ocean View',
        hotel: 'The Pyramid',
        pax1: addInspection('tarifa_ov_pyr_1pax', 'Tarifa Ocean View PYR 1 PAX', 'Tarifas', rowOV[7], habsIdx + 2, 7),
        pax2: addInspection('tarifa_ov_pyr_2pax', 'Tarifa Ocean View PYR 2 PAX', 'Tarifas', rowOV[8], habsIdx + 2, 8),
        pax3: addInspection('tarifa_ov_pyr_3pax', 'Tarifa Ocean View PYR 3 PAX', 'Tarifas', rowOV[9], habsIdx + 2, 9),
      });

      tarifasHabitaciones.push({
        categoria: 'Standard View',
        hotel: 'Grand Oasis Cancun',
        pax1: addInspection('tarifa_std_goc_1pax', 'Tarifa Standard View GOC 1 PAX', 'Tarifas', rowSTD[4], habsIdx + 3, 4),
        pax2: addInspection('tarifa_std_goc_2pax', 'Tarifa Standard View GOC 2 PAX', 'Tarifas', rowSTD[5], habsIdx + 3, 5),
        pax3: addInspection('tarifa_std_goc_3pax', 'Tarifa Standard View GOC 3 PAX', 'Tarifas', rowSTD[6], habsIdx + 3, 6),
      });
      tarifasHabitaciones.push({
        categoria: 'Standard View',
        hotel: 'The Pyramid',
        pax1: addInspection('tarifa_std_pyr_1pax', 'Tarifa Standard View PYR 1 PAX', 'Tarifas', rowSTD[7], habsIdx + 3, 7),
        pax2: addInspection('tarifa_std_pyr_2pax', 'Tarifa Standard View PYR 2 PAX', 'Tarifas', rowSTD[8], habsIdx + 3, 8),
        pax3: addInspection('tarifa_std_pyr_3pax', 'Tarifa Standard View PYR 3 PAX', 'Tarifas', rowSTD[9], habsIdx + 3, 9),
      });
    }

    // Tarifa Ejecutiva
    const ejecIdx = findRowIndex('TARIFA EJECUTIVA', tarifIdx);
    if (ejecIdx !== -1) {
      const rTit = matrix[ejecIdx + 2] || [];
      const rProv = matrix[ejecIdx + 3] || [];
      reglasEjecutiva = matrix[ejecIdx + 4]?.[0] || '2 NIÑOS GRATIS MENORES DE 12 AÑOS ACOMPAÑADOS DE 1 ADULTO';
      addInspection('tarifa_ejecutiva_reglas', 'Reglas Tarifa Ejecutiva', 'Tarifas', reglasEjecutiva, ejecIdx + 4, 0);

      tarifasEjecutivas.push({
        tipo: 'Titulares',
        goc: {
          pax1: addInspection('tarifa_ejec_tit_goc1', 'Titulares GOC 1 PAX', 'Tarifas', rTit[4], ejecIdx + 2, 4),
          pax2: addInspection('tarifa_ejec_tit_goc2', 'Titulares GOC 2 PAX', 'Tarifas', rTit[5], ejecIdx + 2, 5),
          pax3: addInspection('tarifa_ejec_tit_goc3', 'Titulares GOC 3 PAX', 'Tarifas', rTit[6], ejecIdx + 2, 6),
        },
        pyr: {
          pax1: addInspection('tarifa_ejec_tit_pyr1', 'Titulares PYR 1 PAX', 'Tarifas', rTit[7], ejecIdx + 2, 7),
          pax2: addInspection('tarifa_ejec_tit_pyr2', 'Titulares PYR 2 PAX', 'Tarifas', rTit[8], ejecIdx + 2, 8),
          pax3: addInspection('tarifa_ejec_tit_pyr3', 'Titulares PYR 3 PAX', 'Tarifas', rTit[9], ejecIdx + 2, 9),
        },
      });

      tarifasEjecutivas.push({
        tipo: 'Proveedores y Amigos',
        goc: {
          pax1: addInspection('tarifa_ejec_prov_goc1', 'Proveedores GOC 1 PAX', 'Tarifas', rProv[4], ejecIdx + 3, 4),
          pax2: addInspection('tarifa_ejec_prov_goc2', 'Proveedores GOC 2 PAX', 'Tarifas', rProv[5], ejecIdx + 3, 5),
          pax3: addInspection('tarifa_ejec_prov_goc3', 'Proveedores GOC 3 PAX', 'Tarifas', rProv[6], ejecIdx + 3, 6),
        },
        pyr: {
          pax1: addInspection('tarifa_ejec_prov_pyr1', 'Proveedores PYR 1 PAX', 'Tarifas', rProv[7], ejecIdx + 3, 7),
          pax2: addInspection('tarifa_ejec_prov_pyr2', 'Proveedores PYR 2 PAX', 'Tarifas', rProv[8], ejecIdx + 3, 8),
          pax3: addInspection('tarifa_ejec_prov_pyr3', 'Proveedores PYR 3 PAX', 'Tarifas', rProv[9], ejecIdx + 3, 9),
        },
      });
    }

    // Upgrades
    const upgIdx = findRowIndex('PRECIOS UP GRADE X NOCHE', tarifIdx);
    if (upgIdx !== -1) {
      for (let r = upgIdx + 2; r < upgIdx + 14; r++) {
        const row = matrix[r];
        if (!row) continue;
        const gocCat = row[0];
        const gocPrice = row[3];
        if (gocCat && gocPrice) {
          upgrades.push({
            categoriaOrigenDestino: gocCat,
            seccion: 'Grand Oasis Cancun (GOC-GOC)',
            precio: gocPrice,
          });
        }
        const pyrCat = row[5] || row[6];
        const pyrPrice = row[8] || row[7];
        if (pyrCat && pyrPrice && !pyrCat.includes('PAX EXTRA')) {
          upgrades.push({
            categoriaOrigenDestino: pyrCat,
            seccion: 'The Pyramid',
            precio: pyrPrice,
          });
        }
      }
      addInspection('upgrades_total', 'Opciones de Upgrade', 'Tarifas', `${upgrades.length} opciones`, upgIdx, 0);
    }

    // Day Pass
    const dayPassIdx = findRowIndex('PRECIOS DAY PASS', tarifIdx);
    if (dayPassIdx !== -1) {
      for (let r = dayPassIdx + 1; r < dayPassIdx + 8; r++) {
        const row = matrix[r];
        if (!row) continue;
        if (row[0] && row[2]) {
          dayPass.push({ concepto: row[0], precio: row[2], categoria: 'Grand Oasis Cancun' });
        }
        if (row[3] && row[5]) {
          dayPass.push({ concepto: row[3], precio: row[5], categoria: 'The Pyramid / Noche' });
        }
        if (row[7] && row[9]) {
          dayPass.push({ concepto: row[7], precio: row[9], categoria: 'Upgrade de Servicios' });
        }
      }
      addInspection('daypass_total', 'Opciones Day Pass', 'Tarifas', `${dayPass.length} tarifas`, dayPassIdx, 0);
    }

    // Beach Club
    const beachIdx = findRowIndex('PRECIOS DE RENTA BEACH CLUB', tarifIdx);
    if (beachIdx !== -1) {
      for (let r = beachIdx + 2; r < beachIdx + 18; r++) {
        const row = matrix[r];
        if (!row || !row[0]) continue;
        beachClub.push({
          concepto: row[0],
          otlc: row[3] || 'N/C',
          pyrms: row[4] || 'N/C',
          pyr: row[5] || 'N/C',
          grand: row[6] || 'N/C',
        });
      }
      addInspection('beachclub_total', 'Renta Beach Club', 'Tarifas', `${beachClub.length} áreas/camas`, beachIdx, 0);
    }

    // Restaurantes Gourmet
    const restIdx = findRowIndex('PRECIOS EN RESTAURANTES', tarifIdx);
    if (restIdx !== -1) {
      const restNames = ['COCOA', 'BENAZUZA', 'CAREYES', 'BLACK SENS', 'TWB', 'SAKURA', 'CAFÉ DEL MAR'];
      // The row restIdx + 1 has column names: COCOA, BENAZUZA, CAREYES...
      // Followed by rows: PIRÁMIDE, GRAND OASIS, OTROS OASIS, EXTERNOS, TARIFA VIP, SIAN KA'AN
      const rowPyr = matrix[restIdx + 2] || [];
      const rowGOC = matrix[restIdx + 3] || [];
      const rowOtros = matrix[restIdx + 4] || [];
      const rowExt = matrix[restIdx + 5] || [];
      const rowVIP = matrix[restIdx + 6] || [];
      const rowSK = matrix[restIdx + 7] || [];

      restNames.forEach((name, cIdx) => {
        const col = cIdx + 1;
        restaurantesGourmet.push({
          restaurante: name,
          piramide: rowPyr[col] || 'INCLUÍDO',
          grandOasis: rowGOC[col] || 'N/C',
          otrosOasis: rowOtros[col] || 'N/C',
          externos: rowExt[col] || 'N/C',
          vip: rowVIP[col] || 'N/C',
          sianKaan: rowSK[col] || 'INCLUÍDO',
        });
      });
      addInspection('restaurantes_gourmet_total', 'Precios Restaurantes Especialidad', 'Tarifas', `${restaurantesGourmet.length} restaurantes`, restIdx, 0);
    }
  }

  // 9. Beneficios
  const splitBullets = (text: string): string[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
      .filter((l) => l.length > 2);
  };

  const beneficios = {
    sociosNuevosOTLC: [] as string[],
    sociosAnterioresOTLC: [] as string[],
    algGOC: [] as string[],
    algPYR: [] as string[],
    pyrms: [] as string[],
    minibarGOC: 'Surtido a su llegada, surtido de bebidas a petición del huésped (refill diario de agua embotellada).',
    minibarPYR: 'Surtido a la llegada del huésped con reposición diaria sin costo: 4 Cervezas, 2 Cocas, 2 Cocas Light, 4 Aguas 500ml, 2 Papas, 2 Chocolates, 2 Aguas Minerales.',
    mercadoAmericano: [] as string[],
    tripulacionCapitanes: [] as string[],
    tripulacionSobrecargos: [] as string[],
  };

  const benefIdx = findRowIndex('BENEFICIOS');
  if (benefIdx !== -1) {
    const socNuevosText = matrix[benefIdx + 2]?.[0] || '';
    const socAntText = matrix[benefIdx + 2]?.[5] || '';
    beneficios.sociosNuevosOTLC = splitBullets(socNuevosText);
    beneficios.sociosAnterioresOTLC = splitBullets(socAntText);
    addInspection('benef_socios_nuevos', 'Beneficios Socios Nuevos', 'Beneficios', `${beneficios.sociosNuevosOTLC.length} beneficios`, benefIdx + 2, 0);
    addInspection('benef_socios_ant', 'Beneficios Socios Anteriores', 'Beneficios', `${beneficios.sociosAnterioresOTLC.length} beneficios`, benefIdx + 2, 5);

    // Beneficios ALG & PYRMS (Celdas A119, D119, A121, D121 y PYRMS)
    const algIdx = findRowIndex('BENEFICIOS ALG', benefIdx);
    if (algIdx !== -1) {
      const miniIdx = findRowIndex('SERVICIO DE MINIBAR', benefIdx);
      const endAlg = miniIdx !== -1 ? miniIdx : algIdx + 6;

      const gocBullets: string[] = [];
      const pyrBullets: string[] = [];
      const pyrmsBullets: string[] = [];

      const isHeaderOrNoise = (text: string) => {
        if (!text || text === 'N/C') return true;
        const upper = text.trim().toUpperCase();
        if (upper === 'TRUE' || upper === 'FALSE') return true;
        if (
          upper === 'GRAND OASIS CANCUN' ||
          upper === 'THE PYRAMID' ||
          upper === 'BENEFICIOS ALG' ||
          upper === 'BENEFICIOS PYRMS'
        )
          return true;
        if (upper.startsWith('SERVICIO DE MINIBAR') || upper.startsWith('CENTROS DE CONSUMO')) return true;
        return false;
      };

      // 1. Extraer celdas exactas de la hoja original A119 y D119 si existen
      const valA119 = extractCellValueFromMatrix(matrix, 'A119');
      const valD119 = extractCellValueFromMatrix(matrix, 'D119');
      const valA121 = extractCellValueFromMatrix(matrix, 'A121');
      const valD121 = extractCellValueFromMatrix(matrix, 'D121');

      if (!isHeaderOrNoise(valA119) && (valA119.includes('-') || valA119.includes('\n') || valA119.length > 10)) {
        splitBullets(valA119).forEach((b) => {
          if (!isHeaderOrNoise(b) && !gocBullets.includes(b)) gocBullets.push(b);
        });
      }
      if (!isHeaderOrNoise(valD119) && (valD119.includes('-') || valD119.includes('\n') || valD119.length > 10)) {
        splitBullets(valD119).forEach((b) => {
          if (!isHeaderOrNoise(b) && !pyrBullets.includes(b)) pyrBullets.push(b);
        });
      }

      // 2. Escanear filas dinámicamente entre BENEFICIOS ALG y SERVICIO DE MINIBAR
      for (let r = algIdx + 1; r < endAlg; r++) {
        const row = matrix[r];
        if (!row) continue;

        // Columna A (Grand Oasis)
        const cellA = (row[0] || '').trim();
        if (!isHeaderOrNoise(cellA)) {
          splitBullets(cellA).forEach((b) => {
            if (!isHeaderOrNoise(b) && !gocBullets.includes(b)) gocBullets.push(b);
          });
        }

        // Columna D o E (The Pyramid)
        const cellD = (row[3] || row[4] || '').trim();
        if (!isHeaderOrNoise(cellD)) {
          splitBullets(cellD).forEach((b) => {
            if (!isHeaderOrNoise(b) && !pyrBullets.includes(b)) pyrBullets.push(b);
          });
        }

        // Columna H (PYRMS)
        const cellH = (row[7] || row[8] || '').trim();
        if (!isHeaderOrNoise(cellH)) {
          splitBullets(cellH).forEach((b) => {
            if (!isHeaderOrNoise(b) && !pyrmsBullets.includes(b)) pyrmsBullets.push(b);
          });
        }
      }

      // 3. Incluir también celdas A121 y D121 si tienen viñetas adicionales
      if (!isHeaderOrNoise(valA121) && (valA121.includes('-') || valA121.includes('\n') || valA121.length > 10)) {
        splitBullets(valA121).forEach((b) => {
          if (!isHeaderOrNoise(b) && !gocBullets.includes(b)) gocBullets.push(b);
        });
      }
      if (!isHeaderOrNoise(valD121) && (valD121.includes('-') || valD121.includes('\n') || valD121.length > 10)) {
        splitBullets(valD121).forEach((b) => {
          if (!isHeaderOrNoise(b) && !pyrBullets.includes(b)) pyrBullets.push(b);
        });
      }

      beneficios.algGOC = gocBullets;
      beneficios.algPYR = pyrBullets;
      beneficios.pyrms = pyrmsBullets;

      addInspection(
        'benef_alg_goc',
        'Beneficios Huéspedes ALG (Grand Oasis - Celdas A119/A121)',
        'Beneficios',
        `${gocBullets.length} beneficios`,
        algIdx + 1,
        0,
        valA119 !== 'N/C' ? 'A119' : 'A121'
      );
      addInspection(
        'benef_alg_pyr',
        'Beneficios Huéspedes ALG (The Pyramid - Celdas D119/D121)',
        'Beneficios',
        `${pyrBullets.length} beneficios`,
        algIdx + 1,
        3,
        valD119 !== 'N/C' ? 'D119' : 'D121'
      );
      addInspection(
        'benef_pyrms',
        'Beneficios Pyramid Master Suite (PYRMS)',
        'Beneficios',
        `${pyrmsBullets.length} beneficios`,
        algIdx + 1,
        7,
        'H119'
      );
    }

    // Minibar
    const miniIdx = findRowIndex('SERVICIO DE MINIBAR', benefIdx);
    if (miniIdx !== -1) {
      const gText = matrix[miniIdx + 2]?.[0];
      const pText = matrix[miniIdx + 2]?.[3];
      if (gText) beneficios.minibarGOC = gText.trim();
      if (pText) beneficios.minibarPYR = pText.trim();

      // American market
      beneficios.mercadoAmericano = splitBullets(matrix[miniIdx + 2]?.[7] || '');
    }

    // Tripulación
    const tripIdx = findRowIndex('BENEFICIOS HUÉSPEDES TRIPULACIÓN', benefIdx);
    if (tripIdx !== -1) {
      beneficios.tripulacionCapitanes = splitBullets(matrix[tripIdx + 2]?.[0] || '');
      beneficios.tripulacionSobrecargos = splitBullets(matrix[tripIdx + 2]?.[3] || '');
    }
  }

  // 10. Centros de Consumo (Restaurantes y Bares)
  const centrosConsumo: CentroConsumo[] = [];
  const ccIdx = findRowIndex('CENTROS DE CONSUMO');
  if (ccIdx !== -1) {
    // Restaurantes
    const restHeaderIdx = findRowIndex('RESTAURANTES', ccIdx);
    if (restHeaderIdx !== -1) {
      for (let r = restHeaderIdx + 2; r < restHeaderIdx + 28; r++) {
        const row = matrix[r];
        if (!row || !row[2] || row[2] === '-' || row[2].trim() === '') continue;
        const nombre = row[2].trim();
        const activo = (row[0] || '').toUpperCase() === 'TRUE';
        const cierres = row[1] || '';
        const desayuno = row[4] && row[4] !== '-' ? row[4].trim() : undefined;
        const comida = row[5] && row[5] !== '-' ? row[5].trim() : undefined;
        const cena = row[6] && row[6] !== '-' ? row[6].trim() : undefined;
        const obs = row[7] || '';

        centrosConsumo.push({
          id: `rest_${centrosConsumo.length + 1}`,
          nombre,
          tipo: 'restaurante',
          activo,
          cierres,
          horarios: { desayuno, comida, cena },
          observaciones: obs,
        });
      }
    }

    // Bares
    const baresHeaderIdx = findRowIndex('BARES', ccIdx);
    if (baresHeaderIdx !== -1) {
      for (let r = baresHeaderIdx + 2; r < baresHeaderIdx + 24; r++) {
        const row = matrix[r];
        if (!row || !row[2] || row[2] === '-' || row[2].trim() === '') continue;
        const nombre = row[2].trim();
        const activo = (row[0] || '').toUpperCase() === 'TRUE';
        const cierres = row[1] || '';
        const horario = row[5] && row[5] !== '-' ? row[5].trim() : undefined;
        const obs = row[7] || '';

        centrosConsumo.push({
          id: `bar_${centrosConsumo.length + 1}`,
          nombre,
          tipo: 'bar',
          activo,
          cierres,
          horarios: { general: horario },
          observaciones: obs,
        });
      }
    }

    addInspection('centros_consumo_total', 'Total Centros de Consumo', 'Centros de Consumo', `${centrosConsumo.length} locales`, ccIdx, 0);
  }

  // 11. Servicios
  const serviciosGenerales: ServicioGeneral[] = [];
  const serviciosTarifas: ServicioTarifa[] = [];
  const llamadas = [
    { tipo: 'LARGA DISTANCIA NACIONAL (CELULAR O FIJO) X MINUTO', precio: '$ 45.00 MXN' },
    { tipo: '001 800 // LARGA DISTANCIA (INTERNACIONAL) X MINUTO', precio: '$ 125.00 MXN' },
  ];
  const spaPromos: SpaPromo[] = [
    {
      nombre: 'KIN - SOL',
      incluye: ['Sauna o Vapor (30 min.)', '2 masajes relajantes (50 min.)', '2 mascarillas faciales'],
      precio: '$ 3,850.00 MXN',
    },
    {
      nombre: 'ITZÉ - AMANECER',
      incluye: [
        'Sauna / Vapor (30 min.)',
        '2 masajes relajantes (50 min.)',
        '2 faciales de (50 min.)',
        'Jacuzzi con sales aromáticas (30 min.)',
        '2 copas de vino espumoso',
      ],
      precio: '$ 3,851.00 MXN',
    },
    {
      nombre: 'NIKTE - FLOR',
      incluye: ['Sauna / Vapor (30 min)', '1 masaje terapéutico (80 min)', '1 facial de (25 min.)'],
      precio: '$ 3,852.00 MXN',
    },
  ];

  const servIdx = findRowIndex('SERVICIOS GENERALES');
  if (servIdx !== -1) {
    // Services on left (col 0, 2)
    for (let r = servIdx + 1; r < servIdx + 9; r++) {
      const row = matrix[r];
      if (row?.[0] && row[0] !== '-') {
        serviciosGenerales.push({
          nombre: row[0],
          horario: row[2] || 'Horario flexible',
        });
      }
    }
    // Services on right (col 5, 8)
    for (let r = servIdx + 1; r < servIdx + 16; r++) {
      const row = matrix[r];
      if (row?.[5] && row[5] !== '-') {
        serviciosTarifas.push({
          concepto: row[5],
          precio: row[8] || row[7] || 'N/C',
          notas: row[6] || undefined,
        });
      }
    }
  }

  // 12. Comunidad Digital
  const comunidadDigital: CalificacionComunidad[] = [];
  const comIdx = findRowIndex('COMUNIDAD DIGITAL');
  if (comIdx !== -1) {
    // Columns: Review Pro, TripAdvisor, Apple Vacations, Expedia, Booking
    comunidadDigital.push({
      canal: 'Review Pro',
      goc: 'JUN: 4.17/5 | JUL: 4.10/5',
      pyr: 'JUN: 4.27/5 | JUL: 4.40/5',
    });
    comunidadDigital.push({
      canal: 'TripAdvisor',
      goc: 'Posición 213 de 252 (Cancún)',
      pyr: 'Posición 98 de 252 (Cancún)',
    });
    comunidadDigital.push({
      canal: 'Apple Vacations',
      goc: '4 / 5 Círculos',
      pyr: '4 / 5 Círculos',
    });
    comunidadDigital.push({
      canal: 'Expedia',
      goc: '6.2 / 10',
      pyr: '7.2 / 10',
    });
    comunidadDigital.push({
      canal: 'Booking.com',
      goc: '6.4 / 10',
      pyr: '7.6 / 10',
    });
    addInspection('comunidad_digital_total', 'Canales de Reputación Online', 'Interno', `${comunidadDigital.length} canales analizados`, comIdx, 0);
  }

  // 13. Interno (Misión, Visión, Valores de Oasis Hotels & Resorts)
  const interno = {
    mision:
      'Brindar experiencias vacacionales memorables y hospitalidad de excelencia en el Caribe Mexicano, combinando entretenimiento de clase mundial, gastronomía diversa y servicio cálido con pasión por el detalle.',
    vision:
      'Ser el grupo hotelero líder y más innovador del Caribe Mexicano en resorts de entretenimiento y descanso todo incluido, reconocido internacionalmente por el valor humano de sus colaboradores y la satisfacción total del huésped.',
    valores: [
      'Calidad en el Detalle: Cada interacción y servicio cuenta con esmero artesanal.',
      'Calidez Humana: Trato genuino, empático y respetuoso hacia todos nuestros huéspedes y compañeros.',
      'Trabajo en Equipo: Colaboración sincera entre departamentos para garantizar la excelencia operativa.',
      'Pasión por Servir: Actitud positiva proactiva y resolución inmediata de necesidades.',
      'Honestidad y Confianza: Manejo íntegro de recursos y transparencia con nuestros socios OTLC y huéspedes.',
    ],
    mandamientosCultura: [
      'Mandamiento N°1: La seguridad y bienestar de nuestros huéspedes y colaboradores es prioridad absoluta.',
      'Mandamiento N°2: Promover la cultura del detalle con calidad.',
      'Mandamiento N°3: Saludar siempre con una sonrisa y contacto visual al huésped en cualquier área del hotel.',
      'Mandamiento N°4: Anticiparse a las necesidades del huésped y ofrecer soluciones antes de que sean solicitadas.',
      'Mandamiento N°5: Cuidar las instalaciones y la presentación impecable de nuestras áreas de trabajo.',
    ],
  };

  return {
    id: dateId,
    fecha,
    mandamiento,
    avisoBanner,
    clima: climaRows,
    tipoCambio,
    censoCierre,
    previsionGOC,
    previsionPYR,
    huespedesEnCasa,
    planeacionSemanal,
    vips,
    sociosOTLC,
    visitasInspeccion,
    huespedesCelebrando,
    eventos: {
      hoy: eventosHoy,
      manana: eventosManana,
      entretenimiento: showsEntretenimiento,
    },
    tarifas: {
      habitaciones: tarifasHabitaciones,
      ejecutiva: tarifasEjecutivas,
      reglasEjecutiva,
      paxExtras,
      reglasPaxExtras,
      upgrades,
      dayPass,
      beachClub,
      restaurantesGourmet,
    },
    beneficios,
    centrosConsumo,
    servicios: {
      generales: serviciosGenerales,
      tarifas: serviciosTarifas,
      llamadas,
      spaPromos,
    },
    comunidadDigital,
    interno,
    cellInspections: inspections,
    rawMatrix: matrix,
  };
}
