import { ESTILOS_ESTADO } from '@/utils/ticketStyles';
import { ESTADOS_TICKET } from '@/types/ticket.types';
import type { DiaDashboard } from '@/types/dashboard.types';

interface WeeklyTicketsChartProps {
  week: DiaDashboard[];
  statusTotals: Record<string, number>;
}

const PLOT_HEIGHT_CLASS = 'h-40';

export const WeeklyTicketsChart = ({
  week,
  statusTotals,
}: WeeklyTicketsChartProps) => {
  const max = Math.max(...week.map((day) => day.conteo), 0);

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
              const height = Math.round((day.conteo / max) * 100);

              return (
                <div
                  key={day.etiqueta}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[11px] font-bold text-slate-500">
                    {day.conteo}
                  </span>

                  <div
                    className={`w-full rounded-t ${
                      day.conteo === 0 ? 'bg-slate-100' : 'bg-blue-600'
                    }`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                    aria-hidden="true"
                  />

                  <span className="text-[10px] font-bold text-slate-400">
                    {day.etiqueta}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {ESTADOS_TICKET.filter((estado) => (statusTotals[estado] ?? 0) > 0).map(
              (estado) => (
                <span
                  key={estado}
                  className={`rounded px-2 py-1 text-[10px] font-bold ${ESTILOS_ESTADO[estado]}`}
                >
                  {estado} {statusTotals[estado]}
                </span>
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
};