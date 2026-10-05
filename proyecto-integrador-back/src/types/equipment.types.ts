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

export interface Equipment {
  id: string;
  /** Codigo de inventario, ej. `LT-014`. Es la identidad visible del equipo. */
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
  status: EquipmentStatus;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  registeredAt: string;
}

/** El alta la decide el dominio: un equipo nace operativo y con fecha. */
export interface CreateEquipmentInput {
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
}

/** La edicion si permite cambiar el estado, a diferencia del alta. */
export interface UpdateEquipmentInput {
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
  status: EquipmentStatus;
}