import { ESTILOS_PRIORIDAD } from '@/utils/ticketStyles';
import type { NivelSla } from '@/types/sla.types';

interface SlaLevelBadgeProps {
  level: NivelSla;
}

export const SlaLevelBadge = ({ level }: SlaLevelBadgeProps) => {
  return (
    <span
      className={`inline-flex w-20 justify-center rounded-md px-4 py-1.5 text-sm font-semibold ${ESTILOS_PRIORIDAD[level]}`}
    >
      {level}
    </span>
  );
};