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

/**
 * Filtros de la lista, tal como los muestra la pagina. Cada uno combina un tipo
 * o un estado, asi que el filtrado es una sola comparacion por equipo y no un
 * switch. `Monitor` es un tipo mas pero no tiene pill propio.
 *
 * El tipo se deriva de esta lista y no al reves: los contadores que pide
 * EquipmentFilters se keyean con lo mismo, asi que agregar un filtro aqui lo
 * obliga a mostrarlo y a contarlo.
 */
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
  /** ISO 8601. El formateo a texto legible ocurre en el componente. */
  registeredAt: string;
}

/** Refleja lo que el back acepta en POST /equipments. */
export interface CreateEquipmentInput {
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
}

/** Lo que acepta PUT /equipments/:id: a diferencia del alta, si cambia el estado. */
export interface UpdateEquipmentInput {
  code: string;
  name: string;
  area: string;
  type: EquipmentType;
  status: EquipmentStatus;
}