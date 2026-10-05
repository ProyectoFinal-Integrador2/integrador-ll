import {
  Laptop,
  Printer,
  Server,
  Tv,
  type LucideIcon,
} from 'lucide-react';
import type { EquipmentStatus, EquipmentType } from '../types/equipment.types';

/**
 * Paleta por estado e icono por tipo.
 *
 * En el componente original esto eran dos funciones `switch` dentro del render:
 * se recreaban en cada pasada y cambiar un color obligaba a buscarlo a mano.
 * Ahora el color se declara una vez junto al tipo que lo keyea, y el typo avisa
 * si falta un estado o un tipo.
 */
export const EQUIPMENT_STATUS_STYLES: Record<EquipmentStatus, string> = {
  'Operativo': 'bg-[#dcfce7] text-[#16a34a]',
  'En reparación': 'bg-[#dbeafe] text-[#1d4ed8]',
  'Dado de baja': 'bg-[#fee2e2] text-[#dc2626]',
};

/**
 * Iconos de lucide en vez de emoji: se ven igual en todas las plataformas y
 * heredan el color y el tamano del texto, como el resto de la app.
 */
export const EQUIPMENT_TYPE_ICONS: Record<EquipmentType, LucideIcon> = {
  'Laptop': Laptop,
  'Desktop': Server,
  'Impresora': Printer,
  'Monitor': Tv,
};