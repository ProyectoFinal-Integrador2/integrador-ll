import { expect, test } from 'vitest';
import { ServicioDeReportes } from '../src/services/report.service';
import type { TicketRepositorio } from '../src/repositories/ticket.repository';
import type { SlaRepositorio } from '../src/repositories/sla.repository';
import type { Ticket } from '../src/types/ticket.types';
import type { SlaPrioridad } from '../src/types/sla.types';

const compromiso: SlaPrioridad = { id: '1', nivel: 'Medio', descripcion: 'Prueba', minutosRespuesta: 30,
  minutosResolucion: 120, minutosEscalamiento: 60, actualizadoEn: '2026-11-05T00:00:00Z' };
function ticket(respuesta: number | null, resolucion: number | null, extra: Partial<Ticket> = {}): Ticket {
  const inicio = Date.parse('2026-11-05T08:00:00Z');
  return { id: '1', descripcion: 'Incidencia de prueba', solicitante: 'QA', usuarioId: '1', area: 'TI',
    equipoId: null, equipoNombre: null, equipoCodigo: null, prioridad: 'Medio', estado: 'Cerrado',
    tecnicoId: '2', tecnicoNombre: 'QA técnico', creadoEn: new Date(inicio).toISOString(),
    iniciadoEn: respuesta === null ? null : new Date(inicio + respuesta * 60_000).toISOString(),
    cerradoEn: resolucion === null ? null : new Date(inicio + resolucion * 60_000).toISOString(), ...extra };
}
async function reporte(tickets: Ticket[], prioridades = [compromiso]) {
  const repo = { listar: async () => tickets } as TicketRepositorio;
  const sla = { listar: async () => prioridades } as SlaRepositorio;
  return new ServicioDeReportes(repo, undefined, undefined, undefined, sla).cumplimientoSla();
}
test.each([
  ['por debajo', 20, 100, 1], ['en el límite', 30, 120, 1],
  ['respuesta excedida', 31, 100, 0], ['resolución excedida', 20, 121, 0],
  ['ambos excedidos', 31, 121, 0],
])('SLA: %s', async (_nombre, respuesta, resolucion, cumplen) => {
  const r = await reporte([ticket(Number(respuesta), Number(resolucion))]);
  expect(r.evaluables).toBe(1);
  expect(r.cumplen).toBe(cumplen);
  expect(r.porcentajeCumplimiento).toBe(Number(cumplen) * 100);
});
test('sin evaluables no inventa un porcentaje', async () => {
  const r = await reporte([]);
  expect(r.evaluables).toBe(0);
  expect(r.porcentajeCumplimiento).toBeNull();
});
test('sin SLA y sin marcas quedan fuera del denominador', async () => {
  const r = await reporte([ticket(20, 100), ticket(31, 100, { id: '2' }),
    ticket(20, 100, { id: '3', prioridad: 'Bajo' }), ticket(null, null, { id: '4' })]);
  expect(r.sinSla).toBe(1);
  expect(r.sinDatos).toBe(1);
  expect(r.evaluables).toBe(2);
  expect(r.cumplen).toBe(1);
  expect(r.porcentajeCumplimiento).toBe(50);
});
