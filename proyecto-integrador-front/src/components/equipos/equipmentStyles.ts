import { Laptop,Printer,Server,Tv, type LucideIcon} from 'lucide-react';
import type { EstadoEquipo, TipoEquipo } from '../../types/equipment.types';

export const ESTILOS_ESTADO_EQUIPO: Record<EstadoEquipo, string> = {
  'Operativo': 'bg-[#dcfce7] text-[#16a34a]',
  'En reparación': 'bg-[#dbeafe] text-[#1d4ed8]',
  'Dado de baja': 'bg-[#fee2e2] text-[#dc2626]',
};

export const ICONOS_TIPO_EQUIPO: Record<TipoEquipo, LucideIcon> = {
  'Laptop': Laptop,
  'Desktop': Server,
  'Impresora': Printer,
  'Monitor': Tv,
};