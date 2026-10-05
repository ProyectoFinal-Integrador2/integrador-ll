import { TICKET_PRIORITY_STYLES } from '@/constants/ticketStyles';
import type { SlaLevel } from '@/types/sla.types';

interface SlaLevelBadgeProps {
  level: SlaLevel;
}

/**
 * Los cuatro niveles del SLA son los mismos que las prioridades de un ticket,
 * asi que se pintan con `TICKET_PRIORITY_STYLES`: un "Critico" de SLA y un
 * "Critico" de ticket tienen que verse iguales o el usuario los confunde.
 *
 * Es el unico lugar del front que cruza un concepto de tickets con uno de SLA,
 * y es a proposito. Si un dia los niveles se separan, este es el archivo a
 * partir del cual hay que abrir.
 */
export const SlaLevelBadge = ({ level }: SlaLevelBadgeProps) => {
  return (
    <span
      className={`inline-flex w-20 justify-center rounded-md px-4 py-1.5 text-sm font-semibold ${TICKET_PRIORITY_STYLES[level]}`}
    >
      {level}
    </span>
  );
};