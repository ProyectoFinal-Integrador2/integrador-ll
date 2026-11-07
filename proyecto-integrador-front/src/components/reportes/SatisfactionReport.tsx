import { Star, UserRoundCheck } from 'lucide-react';
import { ReportActions } from '@/components/reportes/ReportActions';
import { ReportBarList } from '@/components/reportes/ReportBarList';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { ReportError, ReportLoading } from '@/components/reportes/ReportState';
import { ReportTable, type ReportColumn } from '@/components/reportes/ReportTable';
import { ESTILO_BARRA_PUNTUACION } from '@/components/reportes/reportBarStyles';
import { useReporte } from '@/hooks/useReporte';
import { obtenerReporteSatisfaccion } from '@/services/reportsApi';
import { formatearPromedio } from '@/utils/reportFormat';
import type { SatisfaccionTecnico } from '@/types/report.types';

const columns: ReportColumn<SatisfaccionTecnico>[] = [
  {
    header: 'Tecnico',
    render: (row) => (
      <span className="font-semibold text-slate-700">{row.nombre}</span>
    ),
  },
  { header: 'Evaluaciones', render: (row) => row.total },
  {
    header: 'Promedio',
    render: (row) => (
      <span
        className={
          row.promedioPuntuacion === null
            ? 'text-slate-400'
            : 'font-semibold text-yellow-600'
        }
      >
        {formatearPromedio(row.promedioPuntuacion)}
      </span>
    ),
  },
];

export const SatisfactionReport = () => {
  const { data: report, isLoading, error } = useReporte(
    obtenerReporteSatisfaccion,
  );

  if (error) return <ReportError message={error} />;
  if (isLoading || !report) return <ReportLoading />;

  const evaluados = report.porTecnico.filter(
    (tecnico) => tecnico.total > 0,
  ).length;

  return (
    <>
      <ReportActions
        filename="reporte-satisfaccion"
        sections={[
          {
            titulo: 'Resumen de satisfaccion',
            columnas: ['Indicador', 'Valor'],
            filas: [
              ['Evaluaciones', report.total],
              [
                'Satisfaccion promedio',
                report.promedioPuntuacion ?? 'Sin datos',
              ],
              ['Tecnicos evaluados', evaluados],
              ['Tecnicos en el reporte', report.porTecnico.length],
              ['Generado en', report.generadoEn],
            ],
          },
          {
            titulo: 'Distribucion por estrellas',
            columnas: ['Puntuacion', 'Cantidad', 'Porcentaje'],
            filas: report.porPuntuacion.map((slice) => [
              slice.etiqueta,
              slice.conteo,
              `${slice.porcentaje}%`,
            ]),
          },
          {
            titulo: 'Satisfaccion por tecnico',
            columnas: ['Tecnico', 'Evaluaciones', 'Promedio'],
            filas: report.porTecnico.map((tecnico) => [
              tecnico.nombre,
              tecnico.total,
              tecnico.promedioPuntuacion ?? 'Sin datos',
            ]),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ReportStatCard
          label="Evaluaciones"
          value={String(report.total)}
          hint="Calificaciones registradas"
          icon={<Star className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />

        <ReportStatCard
          label="Satisfaccion promedio"
          value={formatearPromedio(report.promedioPuntuacion)}
          hint="Escala de 1 a 5 estrellas"
          icon={<Star className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />

        <ReportStatCard
          label="Tecnicos evaluados"
          value={String(evaluados)}
          hint={`${report.porTecnico.length} tecnicos en el reporte`}
          icon={<UserRoundCheck className="h-5 w-5" />}
          iconClassName="text-green-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReportBarList
            title="Distribucion por estrellas"
            slices={report.porPuntuacion}
            colorFor={() => ESTILO_BARRA_PUNTUACION}
            emptyMessage="Todavia no hay evaluaciones de servicio."
          />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800">
            Satisfaccion por tecnico
          </h3>
          <ReportTable
            columns={columns}
            rows={report.porTecnico}
            rowKey={(row) => row.id}
            emptyMessage="Todavia no hay tecnicos registrados."
          />
        </section>
      </div>
    </>
  );
};
