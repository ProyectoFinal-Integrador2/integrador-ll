import { useEffect, useState } from 'react';
import { RefreshCw, Star, Ticket, CircleCheckBig } from 'lucide-react';
import { ReportBarList } from '@/components/reportes/ReportBarList';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import {ESTILO_BARRA_PUNTUACION,ESTILOS_BARRAS_PRIORIDAD,ESTILOS_BARRAS_ESTADO} from '@/components/reportes/reportBarStyles';
import { obtenerReporte } from '@/services/reportsApi';
import type { ReporteServicio } from '@/types/report.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const ReportsPage = () => {
  const [report, setReport] = useState<ReporteServicio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    obtenerReporte(controller.signal)
      .then((data) => {
        setReport(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (isAbortError(loadError)) return;
        setError(toMessage(loadError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);

    obtenerReporte()
      .then((data) => {
        setReport(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-end">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label="Actualizar reporte"
          title="Actualizar reporte"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <p className="text-sm font-semibold text-red-700">
            No se pudo generar el reporte
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      ) : isLoading || !report ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm text-slate-500">Generando reporte...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ReportStatCard
              label="Tickets totales"
              value={String(report.tickets.total)}
              hint={`${report.tickets.abiertos} sin cerrar`}
              icon={<Ticket className="h-5 w-5" />}
            />

            <ReportStatCard
              label="Tickets cerrados"
              value={String(report.tickets.cerrados)}
              hint={
                report.tickets.total === 0
                  ? 'Sin tickets registrados'
                  : `${Math.round(
                      (report.tickets.cerrados / report.tickets.total) * 100,
                    )}% del total`
              }
              icon={<CircleCheckBig className="h-5 w-5" />}
              iconClassName="text-green-600"
            />

            <ReportStatCard
              label="Calificacion promedio"
              value={
                report.evaluaciones.promedioPuntuacion === null
                  ? 'Sin datos'
                  : `${report.evaluaciones.promedioPuntuacion} / 5`
              }
              hint={`${report.evaluaciones.total} evaluacion${
                report.evaluaciones.total === 1 ? '' : 'es'
              } registrada${report.evaluaciones.total === 1 ? '' : 's'}`}
              icon={<Star className="h-5 w-5" />}
              iconClassName="text-yellow-500"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ReportBarList
              title="Tickets por estado"
              slices={report.tickets.porEstado}
              colorFor={(label) => ESTILOS_BARRAS_ESTADO[label] ?? 'bg-slate-400'}
              emptyMessage="Todavia no hay tickets registrados."
            />

            <ReportBarList
              title="Tickets por prioridad"
              slices={report.tickets.porPrioridad}
              colorFor={(label) => ESTILOS_BARRAS_PRIORIDAD[label] ?? 'bg-slate-400'}
              emptyMessage="Todavia no hay tickets registrados."
            />

            <ReportBarList
              title="Calificacion por estrellas"
              slices={report.evaluaciones.porPuntuacion}
              colorFor={() => ESTILO_BARRA_PUNTUACION}
              emptyMessage="Todavia no hay evaluaciones de servicio."
            />
          </div>
        </>
      )}
    </div>
  );
};