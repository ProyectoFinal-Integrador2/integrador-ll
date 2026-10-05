import { TICKET_PRIORITY_STYLES, TICKET_STATUS_STYLES } from '../constants/ticketStyles';
import type { Ticket } from '../types/ticket.types';

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

const DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const formatDate = (iso: string): string => DATE_FORMATTER.format(new Date(iso));

export const TicketList = ({ tickets, isLoading, error }: TicketListProps) => {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="text-sm font-semibold text-red-700">No se pudieron cargar los tickets</p>
        <p className="mt-1 text-xs text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm text-slate-500">Cargando tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-700">Sin tickets</p>
        <p className="mt-1 text-xs text-slate-400">
          Ningun ticket coincide con la busqueda o el filtro seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/** Cabecera: solo en pantallas grandes, la lista se apila en movil. */}
      <div className="hidden border-b border-slate-100 px-6 py-3 text-xs font-semibold tracking-wider text-slate-400 uppercase lg:grid lg:grid-cols-[3rem_1fr_10rem_7rem_8rem_6rem] lg:gap-4">
        <span>ID</span>
        <span>Descripcion</span>
        <span>Usuario</span>
        <span>Prioridad</span>
        <span>Estado</span>
        <span className="text-right">Fecha</span>
      </div>

      <ul className="divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-slate-50/70 lg:grid-cols-[3rem_1fr_10rem_7rem_8rem_6rem] lg:items-center lg:gap-4"
          >
            <span className="text-xs font-bold text-slate-400">#{ticket.id}</span>

            <span className="text-sm font-semibold text-slate-800">
              {ticket.description}
            </span>

            <span className="text-xs text-slate-500 lg:text-sm lg:text-slate-600">
              {ticket.user}
            </span>

            <span>
              <span
                className={`inline-block w-full rounded px-2 py-1 text-center text-xs font-semibold lg:w-20 ${TICKET_PRIORITY_STYLES[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
            </span>

            <span>
              <span
                className={`inline-block w-full rounded px-2 py-1 text-center text-xs font-semibold lg:w-28 ${TICKET_STATUS_STYLES[ticket.status]}`}
              >
                {ticket.status}
              </span>
            </span>

            <span className="text-xs text-slate-400 lg:text-right">
              {formatDate(ticket.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
