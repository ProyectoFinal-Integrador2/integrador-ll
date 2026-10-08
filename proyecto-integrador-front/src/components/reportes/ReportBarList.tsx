import type { RebanadaReporte } from '@/types/report.types';

interface ReportBarListProps {
  title: string;
  slices: RebanadaReporte[];
  colorFor: (label: string) => string;
  emptyMessage: string;
}

export const ReportBarList = ({
  title,
  slices,
  colorFor,
  emptyMessage,
}: ReportBarListProps) => {
  const hasData = slices.some((slice) => slice.conteo > 0);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>

      {!hasData ? (
        <p className="mt-4 text-xs text-slate-400">{emptyMessage}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {slices.map((slice) => (
            <li key={slice.etiqueta}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-600">{slice.etiqueta}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {slice.conteo}
                  <span className="ml-2 font-normal text-slate-400">
                    {slice.porcentaje}%
                  </span>
                </span>
              </div>

              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                aria-hidden="true"
              >
                <div
                  className={`h-full rounded-full ${colorFor(slice.etiqueta)}`}
                  style={{ width: `${slice.porcentaje}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};