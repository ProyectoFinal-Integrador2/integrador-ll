import { Laptop,Printer,Server,Tv, type LucideIcon} from 'lucide-react';
import type { EquipmentStatus, EquipmentType } from '../../types/equipment.types';

export const EQUIPMENT_STATUS_STYLES: Record<EquipmentStatus, string> = {
  'Operativo': 'bg-[#dcfce7] text-[#16a34a]',
  'En reparación': 'bg-[#dbeafe] text-[#1d4ed8]',
  'Dado de baja': 'bg-[#fee2e2] text-[#dc2626]',
};

export const EQUIPMENT_TYPE_ICONS: Record<EquipmentType, LucideIcon> = {
  'Laptop': Laptop,
  'Desktop': Server,
  'Impresora': Printer,
  'Monitor': Tv,
};