import type { User } from '../types/user.types';

/**
 * Copia de `USER_SEED` en proyecto-integrador-back/src/repositories/users.seed.ts.
 *
 * La tabla de usuarios ya se pide a la API, pero el login sigue siendo un stub:
 * no hay endpoint de autenticacion, asi que SessionProvider busca aqui el primer
 * usuario del rol elegido. Cuando exista auth real, este archivo desaparece con
 * el resto del stub.
 */
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Torres',
    email: 'ana.torres@empresa.pe',
    role: 'Jefe TI',
    area: 'TI',
    status: 'Activo',
    avatarInitials: 'AT',
    avatarColor: 'blue',
  },
  {
    id: '2',
    name: 'Luis García',
    email: 'luis.garcia@empresa.pe',
    role: 'Técnico',
    area: 'TI',
    status: 'Activo',
    avatarInitials: 'LG',
    avatarColor: 'green',
  },
  {
    id: '3',
    name: 'Carlos Medina',
    email: 'c.medina@empresa.pe',
    role: 'Técnico',
    area: 'TI',
    status: 'Activo',
    avatarInitials: 'CM',
    avatarColor: 'green',
  },
  {
    id: '4',
    name: 'María Ramos',
    email: 'm.ramos@empresa.pe',
    role: 'Usuario',
    area: 'RRHH',
    status: 'Activo',
    avatarInitials: 'MR',
    avatarColor: 'amber',
  },
  {
    id: '5',
    name: 'Pedro Vargas',
    email: 'p.vargas@empresa.pe',
    role: 'Usuario',
    area: 'Contabilidad',
    status: 'Inactivo',
    avatarInitials: 'PV',
    avatarColor: 'amber',
  },
  {
    id: '6',
    name: 'Rosa Flores',
    email: 'r.flores@empresa.pe',
    role: 'Usuario',
    area: 'Ventas',
    status: 'Activo',
    avatarInitials: 'RF',
    avatarColor: 'amber',
  },
  {
    id: '7',
    name: 'Karla Quispe',
    email: 'k.quispe@empresa.pe',
    role: 'Usuario',
    area: 'Ventas',
    status: 'Activo',
    avatarInitials: 'KQ',
    avatarColor: 'amber',
  },
];
