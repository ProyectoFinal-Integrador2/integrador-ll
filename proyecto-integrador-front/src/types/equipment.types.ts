export const EQUIPMENT_TYPES = [
  'Laptop',
  'Desktop',
  'Impresora',
  'Monitor',
] as const;

export const EQUIPMENT_STATUSES = [
  'Operativo',
  'En reparación',
  'Dado de baja',
] as const;

export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];

export const EQUIPMENT_FILTERS = [
  'todos',
  'Laptop',
  'Desktop',
  'Impresora',
  'En reparación',
] as const;

export type EquipmentFilter = (typeof EQUIPMENT_FILTERS)[number];

export interface Equipment {
  id: string;
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
  status: EquipmentStatus;
  registeredAt: string;
}
export interface CreateEquipmentInput {
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
}

export interface UpdateEquipmentInput {
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
  status: EquipmentStatus;
}