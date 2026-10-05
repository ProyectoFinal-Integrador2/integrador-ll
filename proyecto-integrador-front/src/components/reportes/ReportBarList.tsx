import type { ReportSlice } from '@/types/report.types';

interface ReportBarListProps {
  title: string;
  slices: ReportSlice[];
  /** Clase de relleno de la barra para cada etiqueta. */
  colorFor: (label: string) => string;
  emptyMessage: string;
}

/**
 * Barras horizontales hechas con `div`, sin libreria de graficos: el reporte
 * tiene pocas categorias y una barra con dos clases de Tailwind no necesita
 * Recharts weighing 100 kB.
 */
export const ReportBarList = ({
  title,
  slices,
  colorFor,
  emptyMessage,
}: ReportBarListProps) => {
  const hasData = slices.some((slice) => slice.count > 0);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>

      {!hasData ? (
        <p className="mt-4 text-xs text-slate-400">{emptyMessage}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {slices.map((slice) => (
            <li key={slice.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-600">{slice.label}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {slice.count}
                  <span className="ml-2 font-normal text-slate-400">
                    {slice.percentage}%
                  </span>
                </span>
              </div>

              {/**
               * El ancho va en `style` porque depende del dato, y el ancho de
               * una barra tiene que ser proporcional a la verdad, no a una clase
               * de Tailwind. La barra es decorativa: el valor ya esta escrito
               * arriba en texto.
               */}
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                aria-hidden="true"
              >
                <div
                  className={`h-full rounded-full ${colorFor(slice.label)}`}
                  style={{ width: `${slice.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};