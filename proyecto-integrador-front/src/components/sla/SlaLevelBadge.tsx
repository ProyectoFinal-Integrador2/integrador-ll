import { TICKET_PRIORITY_STYLES } from '@/constants/ticketStyles';
import type { SlaLevel } from '@/types/sla.types';

interface SlaLevelBadgeProps {
  level: SlaLevel;
}

export const SlaLevelBadge = ({ level }: SlaLevelBadgeProps) => {
  return (
    <span
      className={`inline-flex w-20 justify-center rounded-md px-4 py-1.5 text-sm font-semibold ${TICKET_PRIORITY_STYLES[level]}`}
    >
      {level}
    </span>
  );
};