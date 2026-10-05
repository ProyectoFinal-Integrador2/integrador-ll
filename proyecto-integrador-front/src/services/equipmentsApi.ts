import { apiGet, apiSend } from './apiClient';
import type {
  CreateEquipmentInput,
  Equipment,
  UpdateEquipmentInput,
} from '../types/equipment.types';

export const fetchEquipments = (signal?: AbortSignal): Promise<Equipment[]> =>
  apiGet<Equipment[]>('/equipments', signal);

/** El back responde el equipo ya creado, asi que no hay que recargar la lista. */
export const createEquipment = (input: CreateEquipmentInput): Promise<Equipment> =>
  apiSend<Equipment>('/equipments', 'POST', input);

export const updateEquipment = (
  id: string,
  input: UpdateEquipmentInput,
): Promise<Equipment> => apiSend<Equipment>(`/equipments/${id}`, 'PUT', input);