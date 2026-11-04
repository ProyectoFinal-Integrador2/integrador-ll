import { CircleCheckBig, Star, Ticket } from 'lucide-react';
import { ReportActions } from '@/components/reportes/ReportActions';
import { ReportBarList } from '@/components/reportes/ReportBarList';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { ReportError, ReportLoading } from '@/components/reportes/ReportState';
import {
  ESTILO_BARRA_PUNTUACION,
  ESTILOS_BARRAS_ESTADO,
  ESTILOS_BARRAS_PRIORIDAD,
} from '@/components/reportes/reportBarStyles';
import { useReporte } from '@/hooks/useReporte';
import { obtenerReporte } from '@/services/reportsApi';

export const ReportsSummary = () => {
  const { data: report, isLoading, error } = useReporte(obtenerReporte);

  if (error) return <ReportError message={error} />;
  if (isLoading || !report) return <ReportLoading />;

  return (
    <>
      <ReportActions
        filename="reporte-resumen"
        sections={[
          {
            titulo: 'Resumen general',
            columnas: ['Indicador', 'Valor'],
            filas: [
              ['Tickets totales', report.tickets.total],
              ['Tickets abiertos', report.tickets.abiertos],
              ['Tickets cerrados', report.tickets.cerrados],
              ['Evaluaciones', report.evaluaciones.total],
              [
                'Calificacion promedio',
                report.evaluaciones.promedioPuntuacion ?? 'Sin datos',
              ],
              ['Generado en', report.generadoEn],
            ],
          },
          {
            titulo: 'Tickets por estado',
            columnas: ['Estado', 'Cantidad', 'Porcentaje'],
            filas: report.tickets.porEstado.map((slice) => [
              slice.etiqueta,
              slice.conteo,
              `${slice.porcentaje}%`,
            ]),
          },
          {
            titulo: 'Tickets por prioridad',
            columnas: ['Prioridad', 'Cantidad', 'Porcentaje'],
            filas: report.tickets.porPrioridad.map((slice) => [
              slice.etiqueta,
              slice.conteo,
              `${slice.porcentaje}%`,
            ]),
          },
          {
            titulo: 'Evaluaciones por puntuacion',
            columnas: ['Puntuacion', 'Cantidad', 'Porcentaje'],
            filas: report.evaluaciones.porPuntuacion.map((slice) => [
              slice.etiqueta,
              slice.conteo,
              `${slice.porcentaje}%`,
            ]),
          },
        ]}
      />

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
  );
};
