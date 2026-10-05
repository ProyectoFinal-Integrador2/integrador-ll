import { TICKET_STATUS_STYLES } from '@/constants/ticketStyles';
import { TICKET_STATUSES } from '@/types/ticket.types';
import type { DashboardWeekDay } from '@/types/dashboard.types';

interface WeeklyTicketsChartProps {
  week: DashboardWeekDay[];
  /** Conteos reales por estado, para la leyenda. */
  statusTotals: Record<string, number>;
}

/** Altura fija del area de barras; las barras se escalan dentro. */
const PLOT_HEIGHT_CLASS = 'h-40';

export const WeeklyTicketsChart = ({
  week,
  statusTotals,
}: WeeklyTicketsChartProps) => {
  const max = Math.max(...week.map((day) => day.count), 0);

  return (
    <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-800">
        Tickets por dia (semana actual)
      </h3>

      {max === 0 ? (
        <p className="flex flex-1 items-center justify-center py-6 text-center text-xs text-slate-400">
          No se registro ningun ticket esta semana.
        </p>
      ) : (
        <>
          <div className={`mt-4 flex ${PLOT_HEIGHT_CLASS} items-end gap-2`}>
            {week.map((day) => {
              // Proporcional al dia mas cheio, no al total: asi la semana se
              // lee de un vistazo aunque los numeros sean bajos.
              const height = Math.round((day.count / max) * 100);

              return (
                <div
                  key={day.label}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[11px] font-bold text-slate-500">
                    {day.count}
                  </span>

                  <div
                    className={`w-full rounded-t ${
                      day.count === 0 ? 'bg-slate-100' : 'bg-blue-600'
                    }`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                    aria-hidden="true"
                  />

                  <span className="text-[10px] font-bold text-slate-400">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/**
           * Leyenda con los conteos reales. El prototipo traia numeros fijos
           * ("Abierto 18", "Cancelado 3"): los numeros salen de la data y
           * `Cancelado` ahora existe como estado, asi que aparece solo si hay
           * tickets cancelados.
           */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {TICKET_STATUSES.filter((status) => (statusTotals[status] ?? 0) > 0).map(
              (status) => (
                <span
                  key={status}
                  className={`rounded px-2 py-1 text-[10px] font-bold ${TICKET_STATUS_STYLES[status]}`}
                >
                  {status} {statusTotals[status]}
                </span>
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
};