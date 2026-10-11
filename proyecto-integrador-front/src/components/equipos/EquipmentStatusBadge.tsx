import { ESTILOS_ESTADO_EQUIPO } from '@/components/equipos/equipmentStyles';
import type { EstadoEquipo } from '@/types/equipment.types';

interface EquipmentStatusBadgeProps {
  status: EstadoEquipo;
}

export const EquipmentStatusBadge = ({ status }: EquipmentStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${ESTILOS_ESTADO_EQUIPO[status]}`}
    >
      {status}
    </span>
  );
};