import { EQUIPMENT_STATUS_STYLES } from '@/components/equipos/equipmentStyles';
import type { EquipmentStatus } from '@/types/equipment.types';

interface EquipmentStatusBadgeProps {
  status: EquipmentStatus;
}

export const EquipmentStatusBadge = ({ status }: EquipmentStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${EQUIPMENT_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
};