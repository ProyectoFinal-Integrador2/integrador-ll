import type { KnowledgeCategory } from '../types/knowledge.types';

export interface KnowledgeRecord {
  id: string;
  title: string;
  category: KnowledgeCategory;
  authorId: string;
  views: number;
  createdAt: string;
}

export const KNOWLEDGE_SEED: KnowledgeRecord[] = [
  {
    id: '1',
    title: 'Como corregir el WiFi que se corta en las reuniones',
    category: 'Red',
    authorId: '2',
    views: 148,
    createdAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Diagnostico de laptops que no encienden con el cargador',
    category: 'Hardware',
    authorId: '3',
    views: 231,
    createdAt: '2026-09-22T15:30:00.000Z',
  },
  {
    id: '3',
    title: 'Solicitud de clave de correo corporativa',
    category: 'Software',
    authorId: '2',
    views: 96,
    createdAt: '2026-09-29T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'La impresora imprime en blanco: pasos a revisar',
    category: 'Impresoras',
    authorId: '3',
    views: 174,
    createdAt: '2026-10-01T11:45:00.000Z',
  },
  {
    id: '5',
    title: 'Como acceder al ERP cuando la clave caduca',
    category: 'ERP',
    authorId: '1',
    views: 312,
    createdAt: '2026-10-03T08:20:00.000Z',
  },
  {
    id: '6',
    title: 'Configurar el correo en Outlook por primera vez',
    category: 'Software',
    authorId: '2',
    views: 65,
    createdAt: '2026-10-04T14:05:00.000Z',
  },
];