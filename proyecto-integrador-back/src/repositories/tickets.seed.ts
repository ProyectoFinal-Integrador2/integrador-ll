import type { Ticket } from '../types/ticket.types';

/**
 * Datos de arranque. Mismo criterio que MOCK_USERS en el frontend: mientras
 * no haya base de datos, el repositorio arranca con una lista fija.
 */
export const TICKET_SEED: Ticket[] = [
  {
    id: '1',
    description: 'El portatil no enciende al conectar el cargador',
    user: 'María Ramos',
    priority: 'Crítico',
    status: 'En progreso',
    createdAt: '2026-09-28T09:15:00.000Z',
  },
  {
    id: '2',
    description: 'Sin acceso a la carpeta compartida del area',
    user: 'Pedro Vargas',
    priority: 'Alto',
    status: 'Abierto',
    createdAt: '2026-09-29T11:40:00.000Z',
  },
  {
    id: '3',
    description: 'Solicita monitor adicional para su puesto',
    user: 'Rosa Flores',
    priority: 'Medio',
    status: 'Abierto',
    createdAt: '2026-09-30T08:05:00.000Z',
  },
  {
    id: '4',
    description: 'La impresora de Ventas imprime en blanco',
    user: 'Karla Quispe',
    priority: 'Alto',
    status: 'Cerrado',
    createdAt: '2026-09-25T14:30:00.000Z',
  },
  {
    id: '5',
    description: 'Pide alta de correo corporativo',
    user: 'Carlos Medina',
    priority: 'Bajo',
    status: 'Cerrado',
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: '6',
    description: 'WiFi se corta en la sala de reuniones 3',
    user: 'Luis García',
    priority: 'Medio',
    status: 'En progreso',
    createdAt: '2026-10-01T16:20:00.000Z',
  },
  {
    id: '7',
    description: 'Error al abrir el sistema de incidencias',
    user: 'Ana Torres',
    priority: 'Crítico',
    status: 'Abierto',
    createdAt: '2026-10-02T07:45:00.000Z',
  },
];
