import type { Equipment } from '../types/equipment.types';

/**
 * Datos de arranque. El frontend no los tiene: esta es la unica fuente de la
 * tabla de equipos hasta que exista la base de datos.
 */
export const EQUIPMENT_SEED: Equipment[] = [
  {
    id: '1',
    code: 'LT-001',
    name: 'HP ProBook 450 G9',
    area: 'TI',
    type: 'Laptop',
    status: 'Operativo',
    registeredAt: '2026-03-02T08:30:00.000Z',
  },
  {
    id: '2',
    code: 'LT-014',
    name: 'Dell Latitude 5440',
    area: 'Contabilidad',
    type: 'Laptop',
    status: 'En reparación',
    registeredAt: '2026-03-05T10:15:00.000Z',
  },
  {
    id: '3',
    code: 'DS-007',
    name: 'OptiPlex 7010 SFF',
    area: 'TI',
    type: 'Desktop',
    status: 'Operativo',
    registeredAt: '2026-03-06T09:00:00.000Z',
  },
  {
    id: '4',
    code: 'DS-012',
    name: 'ThinkCentre M70q',
    area: 'Ventas',
    type: 'Desktop',
    status: 'Operativo',
    registeredAt: '2026-03-10T14:45:00.000Z',
  },
  {
    id: '5',
    code: 'DS-019',
    name: 'ProDesk 400 G7',
    area: 'RRHH',
    type: 'Desktop',
    status: 'Dado de baja',
    registeredAt: '2026-02-18T11:20:00.000Z',
  },
  {
    id: '6',
    code: 'IM-003',
    name: 'HP LaserJet Pro M404',
    area: 'Ventas',
    type: 'Impresora',
    status: 'Operativo',
    registeredAt: '2026-02-24T08:50:00.000Z',
  },
  {
    id: '7',
    code: 'IM-008',
    name: 'Epson EcoTank L3250',
    area: 'RRHH',
    type: 'Impresora',
    status: 'En reparación',
    registeredAt: '2026-03-01T16:05:00.000Z',
  },
  {
    id: '8',
    code: 'MN-021',
    name: 'Dell UltraSharp U2723QE',
    area: 'TI',
    type: 'Monitor',
    status: 'Operativo',
    registeredAt: '2026-03-11T13:30:00.000Z',
  },
  {
    id: '9',
    code: 'MN-026',
    name: 'LG 27UL500-W',
    area: 'Contabilidad',
    type: 'Monitor',
    status: 'Operativo',
    registeredAt: '2026-03-12T09:40:00.000Z',
  },
];