import { Ticket, UserRoundCheck, Users } from 'lucide-react';
import { ReportActions } from '@/components/reportes/ReportActions';
import { ReportBarList } from '@/components/reportes/ReportBarList';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { ReportError, ReportLoading } from '@/components/reportes/ReportState';
import { ReportTable, type ReportColumn } from '@/components/reportes/ReportTable';
import { useReporte } from '@/hooks/useReporte';
import { obtenerReporteCarga } from '@/services/reportsApi';
import { formatearMinutos } from '@/utils/reportFormat';
import type { CargaTecnico, RebanadaReporte } from '@/types/report.types';

const columns: ReportColumn<CargaTecnico>[] = [
  {
    header: 'Tecnico',
    render: (row) => (
      <span className="font-semibold text-slate-700">{row.nombre}</span>
    ),
  },
  {
    header: 'Activos',
    render: (row) => (
      <span className="font-semibold text-amber-600">{row.activos}</span>
    ),
  },
  { header: 'Cerrados', render: (row) => row.cerrados },
  { header: 'Cancelados', render: (row) => row.cancelados },
  { header: 'Asignados', render: (row) => row.asignados },
  {
    header: 'Resol. prom.',
    render: (row) => formatearMinutos(row.promedioResolucionMin),
  },
];

const aRebanadas = (tecnicos: CargaTecnico[]): RebanadaReporte[] => {
  const total = tecnicos.reduce((acc, tecnico) => acc + tecnico.activos, 0);

  return tecnicos.map((tecnico) => ({
    etiqueta: tecnico.nombre,
    conteo: tecnico.activos,
    porcentaje: total === 0 ? 0 : Math.round((tecnico.activos / total) * 100),
  }));
};

export const TechnicianWorkloadReport = () => {
  const { data: report, isLoading, error } = useReporte(obtenerReporteCarga);

  if (error) return <ReportError message={error} />;
  if (isLoading || !report) return <ReportLoading />;

  return (
    <>
      <ReportActions
        filename="reporte-carga-tecnicos"
        sections={[
          {
            titulo: 'Resumen de carga',
            columnas: ['Indicador', 'Valor'],
            filas: [
              ['Tickets totales', report.totalTickets],
              ['Tickets sin asignar', report.sinAsignar],
              ['Tecnicos en el reporte', report.tecnicos.length],
              ['Generado en', report.generadoEn],
            ],
          },
          {
            titulo: 'Detalle por tecnico',
            columnas: [
              'Tecnico',
              'Activos',
              'Cerrados',
              'Cancelados',
              'Asignados',
              'Resolucion promedio (min)',
            ],
            filas: report.tecnicos.map((tecnico) => [
              tecnico.nombre,
              tecnico.activos,
              tecnico.cerrados,
              tecnico.cancelados,
              tecnico.asignados,
              tecnico.promedioResolucionMin ?? 'Sin datos',
            ]),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ReportStatCard
          label="Tickets totales"
          value={String(report.totalTickets)}
          hint="Historico completo del sistema"
          icon={<Ticket className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Sin asignar"
          value={String(report.sinAsignar)}
          hint="En cola, sin tecnico"
          icon={<Users className="h-5 w-5" />}
          iconClassName="text-amber-600"
        />

        <ReportStatCard
          label="Tecnicos en el reporte"
          value={String(report.tecnicos.length)}
          hint="Activos o con tickets asignados"
          icon={<UserRoundCheck className="h-5 w-5" />}
          iconClassName="text-green-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReportBarList
            title="Carga activa por tecnico"
            slices={aRebanadas(report.tecnicos)}
            colorFor={() => 'bg-amber-500'}
            emptyMessage="Ningun tecnico tiene tickets en progreso."
          />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800">
            Detalle por tecnico
          </h3>
          <ReportTable
            columns={columns}
            rows={report.tecnicos}
            rowKey={(row) => row.id}
            emptyMessage="Todavia no hay tecnicos registrados."
          />
        </section>
      </div>
    </>
  );
};
