import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSVToMatrix, parseBriefingData } from './briefingParser';
import fs from 'node:fs';
import path from 'node:path';

test('parseCSVToMatrix parses quotes and commas correctly', () => {
  const sample = `A,B,"C,D"\n1,2,"Hello\nWorld"`;
  const matrix = parseCSVToMatrix(sample);
  assert.equal(matrix.length, 2);
  assert.equal(matrix[0][2], 'C,D');
  assert.equal(matrix[1][2], 'Hello\nWorld');
});

test('parseBriefingData extracts date, mandamiento, and handles N/C fallback', () => {
  const minimalCSV = `,,viernes 28 de agosto del 2026,,,,,,,
,,"Mandamiento  N°2: ""Promover la cultura del detalle con calidad""",,,,,,,
SIAN KA'AN BEACH CLUB & CAFE DEL MAR INCLUIDO PARA SOCIOS OTLC Y HUÉSPEDES PYRAMID MASTER SUITE,,,,,,,,,
CLIMA,,,,,,,,,
VIERNES 28 ,,SÁBADO 29 ,,DOMINGO 30 ,,LUNES 31 ,,MARTES 1 ,
MAX: 32 °C,MIN: 26°C ,MAX: 32 °C,MIN: 26°C ,MAX: 33 °C,MIN: 26°C ,MAX: 33 °C,MIN: 26°C ,MAX: 32 °C,MIN: 26°C 
Probabilidad: 40%,,Probabilidad: 35%,,Probabilidad: 65%,,Probabilidad: 15%,,Probabilidad: 55%,
Parcialmente nublado,,Parcialmente nublado,,Parcialmente nublado,,Parcialmente nublado,,Parcialmente nublado,
TIPO DE CAMBIO,,,,,,,,,
*DOF*,$16.9647,,DÓLAR USD,,DÓLAR CANADIENSE,,EURO,,LIBRA ESTERLINA
,,,$15.13,,$10.48,,$18.06,,$21.31
`;

  const parsed = parseBriefingData(minimalCSV);
  assert.equal(parsed.fecha, 'viernes 28 de agosto del 2026');
  assert.ok(parsed.mandamiento.includes('cultura del detalle con calidad'));
  assert.equal(parsed.tipoCambio.usd, '$15.13');
  assert.equal(parsed.tipoCambio.dof, '$16.9647');
  assert.equal(parsed.clima.length, 5);
  assert.equal(parsed.clima[0].dia, 'VIERNES 28');
  assert.ok(parsed.cellInspections.length > 0);
});

test('parseBriefingData handles full sample file if exists', () => {
  const filePath = path.resolve('public/assets/aistudio/BRIEFING_26_AGOSTO_8c2ba2b2');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseBriefingData(content);
    assert.equal(parsed.censoCierre.ocupacionPct, '73.14%');
    assert.equal(parsed.censoCierre.llegadas, '118');
    assert.equal(parsed.censoCierre.salidas, '119');
    assert.equal(parsed.previsionGOC.habOcupadas, '426');
    assert.equal(parsed.previsionPYR.habOcupadas, '341');
    assert.equal(parsed.huespedesEnCasa.total.complejo, '1742');
    assert.ok(parsed.eventos.hoy.length > 0);
    assert.ok(parsed.vips.enCasa.length > 0);
    assert.ok(parsed.centrosConsumo.length > 0);
  }
});
