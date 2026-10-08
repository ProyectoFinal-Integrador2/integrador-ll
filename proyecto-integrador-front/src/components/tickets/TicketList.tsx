import { ESTILOS_PRIORIDAD, ESTILOS_ESTADO } from '@/utils/ticketStyles';
import { formatearFecha } from '@/utils/date';
import type { Ticket } from '@/types/ticket.types';

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  onSelectTicket?: (ticket: Ticket) => void;
}

export const TicketList = ({
  tickets,
  isLoading,
  error,
  onSelectTicket,
}: TicketListProps) => {
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
          <li key={ticket.id}>
            <button
              type="button"
              onClick={onSelectTicket ? () => onSelectTicket(ticket) : undefined}
              disabled={!onSelectTicket}
              className="grid w-full grid-cols-1 gap-2 px-6 py-4 text-left transition-colors enabled:hover:bg-slate-50/70 disabled:cursor-default lg:grid-cols-[3rem_1fr_10rem_7rem_8rem_6rem] lg:items-center lg:gap-4"
            >
              <span className="text-xs font-bold text-slate-400">#{ticket.id}</span>

              <span className="text-sm font-semibold text-slate-800">
                {ticket.descripcion}
              </span>

              <span className="text-xs text-slate-500 lg:text-sm lg:text-slate-600">
                {ticket.solicitante}
              </span>

              <span>
                <span
                  className={`inline-block w-full rounded px-2 py-1 text-center text-xs font-semibold lg:w-20 ${ESTILOS_PRIORIDAD[ticket.prioridad]}`}
                >
                  {ticket.prioridad}
                </span>
              </span>

              <span>
                <span
                  className={`inline-block w-full rounded px-2 py-1 text-center text-xs font-semibold lg:w-28 ${ESTILOS_ESTADO[ticket.estado]}`}
                >
                  {ticket.estado}
                </span>
              </span>

              <span className="text-xs text-slate-400 lg:text-right">
                {formatearFecha(ticket.creadoEn)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
