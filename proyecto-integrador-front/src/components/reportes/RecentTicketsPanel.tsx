import { Link } from 'react-router-dom';
import { ESTILOS_PRIORIDAD, ESTILOS_ESTADO } from '@/utils/ticketStyles';
import { formatearFecha } from '@/utils/date';
import type { Ticket } from '@/types/ticket.types';

interface RecentTicketsPanelProps {
  tickets: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
  title?: string;
}

export const RecentTicketsPanel = ({
  tickets,
  onSelectTicket,
  title = 'Tickets recientes',
}: RecentTicketsPanelProps) => {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>

        <Link
          to="/tickets"
          className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Ver todos &rarr;
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-400">
          Todavia no hay tickets registrados.
        </p>
      ) : (
        <ul className="flex-1 divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className={`py-3 first:pt-0 last:pb-0 ${
                onSelectTicket ? 'cursor-pointer' : ''
              }`}
            >
              <button
                type="button"
                onClick={onSelectTicket ? () => onSelectTicket(ticket) : undefined}
                disabled={!onSelectTicket}
                className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg text-left transition-colors enabled:hover:bg-slate-50 disabled:cursor-default"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-8 shrink-0 text-sm font-medium text-slate-400">
                    #{ticket.id}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {ticket.descripcion}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {ticket.solicitante} &middot; {formatearFecha(ticket.creadoEn)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 pl-11 sm:pl-0">
                  <span
                    className={`w-16 rounded px-2 py-1 text-center text-[10px] font-bold ${ESTILOS_PRIORIDAD[ticket.prioridad]}`}
                  >
                    {ticket.prioridad}
                  </span>
                  <span
                    className={`w-24 rounded px-2 py-1 text-center text-[10px] font-bold ${ESTILOS_ESTADO[ticket.estado]}`}
                  >
                    {ticket.estado}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};