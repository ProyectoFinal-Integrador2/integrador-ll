import { CircleCheckBig, Clock, Ticket } from 'lucide-react';
import { ReportActions } from '@/components/reportes/ReportActions';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { ReportError, ReportLoading } from '@/components/reportes/ReportState';
import { ReportTable, type ReportColumn } from '@/components/reportes/ReportTable';
import { useReporte } from '@/hooks/useReporte';
import { obtenerReporteSla } from '@/services/reportsApi';
import { formatearMinutos, formatearPorcentaje } from '@/utils/reportFormat';
import { formatearFecha } from '@/utils/date';
import { ESTILOS_PRIORIDAD } from '@/utils/ticketStyles';
import type {
  ReporteSlaPrioridad,
  TicketSlaIncumplido,
} from '@/types/report.types';

const prioridadColumns: ReportColumn<ReporteSlaPrioridad>[] = [
  {
    header: 'Nivel',
    render: (row) => (
      <span className="font-semibold text-slate-700">{row.nivel}</span>
    ),
  },
  { header: 'Cerrados', render: (row) => row.tickets },
  { header: 'Evaluables', render: (row) => row.evaluables },
  { header: 'Cumplen', render: (row) => row.cumplen },
  {
    header: 'Cumplimiento',
    render: (row) => formatearPorcentaje(row.porcentajeCumplimiento),
  },
  {
    header: 'Resp. prom.',
    render: (row) => formatearMinutos(row.promedioRespuestaMin),
  },
  {
    header: 'Resol. prom.',
    render: (row) => formatearMinutos(row.promedioResolucionMin),
  },
];

const incumplidoColumns: ReportColumn<TicketSlaIncumplido>[] = [
  {
    header: 'Ticket',
    render: (row) => (
      <span className="font-semibold text-slate-700">#{row.id}</span>
    ),
  },
  {
    header: 'Prioridad',
    render: (row) => (
      <span
        className={`rounded px-2 py-0.5 text-[11px] font-bold ${ESTILOS_PRIORIDAD[row.prioridad]}`}
      >
        {row.prioridad}
      </span>
    ),
  },
  {
    header: 'Tecnico',
    render: (row) => row.tecnicoNombre ?? 'Sin asignar',
  },
  {
    header: 'Respuesta',
    render: (row) => (
      <span>
        {formatearMinutos(row.minutosRespuesta)}
        <span className="ml-1 text-slate-400">
          / {formatearMinutos(row.slaRespuestaMin)}
        </span>
      </span>
    ),
  },
  {
    header: 'Resolucion',
    render: (row) => (
      <span>
        {formatearMinutos(row.minutosResolucion)}
        <span className="ml-1 text-slate-400">
          / {formatearMinutos(row.slaResolucionMin)}
        </span>
      </span>
    ),
  },
  {
    header: 'Cierre',
    render: (row) => formatearFecha(row.cerradoEn),
  },
];

export const SlaComplianceReport = () => {
  const { data: report, isLoading, error } = useReporte(obtenerReporteSla);

  if (error) return <ReportError message={error} />;
  if (isLoading || !report) return <ReportLoading />;

  return (
    <>
      <ReportActions
        filename="reporte-sla"
        sections={[
          {
            titulo: 'Resumen SLA',
            columnas: ['Indicador', 'Valor'],
            filas: [
              ['Tickets totales', report.totalTickets],
              ['Tickets cerrados', report.cerrados],
              ['Tickets cancelados', report.cancelados],
              ['Tickets en curso', report.enCurso],
              ['Tickets evaluables', report.evaluables],
              ['Tickets que cumplen', report.cumplen],
              [
                'Cumplimiento',
                formatearPorcentaje(report.porcentajeCumplimiento),
              ],
              ['Tickets sin SLA', report.sinSla],
              ['Tickets sin datos', report.sinDatos],
              ['Generado en', report.generadoEn],
            ],
          },
          {
            titulo: 'Cumplimiento por prioridad',
            columnas: [
              'Nivel',
              'Cerrados',
              'Evaluables',
              'Cumplen',
              'Cumplimiento',
              'Respuesta promedio (min)',
              'Resolucion promedio (min)',
            ],
            filas: report.porPrioridad.map((prioridad) => [
              prioridad.nivel,
              prioridad.tickets,
              prioridad.evaluables,
              prioridad.cumplen,
              formatearPorcentaje(prioridad.porcentajeCumplimiento),
              prioridad.promedioRespuestaMin ?? 'Sin datos',
              prioridad.promedioResolucionMin ?? 'Sin datos',
            ]),
          },
          {
            titulo: 'Incumplimientos',
            columnas: [
              'Ticket',
              'Prioridad',
              'Tecnico',
              'Creado',
              'Iniciado',
              'Cerrado',
              'Respuesta (min)',
              'SLA respuesta (min)',
              'Exceso respuesta (min)',
              'Resolucion (min)',
              'SLA resolucion (min)',
              'Exceso resolucion (min)',
            ],
            filas: report.incumplidos.map((incumplido) => [
              incumplido.id,
              incumplido.prioridad,
              incumplido.tecnicoNombre ?? 'Sin asignar',
              incumplido.creadoEn,
              incumplido.iniciadoEn,
              incumplido.cerradoEn,
              incumplido.minutosRespuesta,
              incumplido.slaRespuestaMin,
              incumplido.excesoRespuestaMin,
              incumplido.minutosResolucion,
              incumplido.slaResolucionMin,
              incumplido.excesoResolucionMin,
            ]),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard
          label="Cumplimiento SLA"
          value={formatearPorcentaje(report.porcentajeCumplimiento)}
          hint={`${report.cumplen} de ${report.evaluables} tickets evaluables`}
          icon={<CircleCheckBig className="h-5 w-5" />}
          iconClassName="text-green-600"
        />

        <ReportStatCard
          label="Tickets cerrados"
          value={String(report.cerrados)}
          hint={`${report.enCurso} en curso`}
          icon={<Ticket className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Sin SLA configurado"
          value={String(report.sinSla)}
          hint="Tickets cuya prioridad no tiene SLA"
          icon={<Clock className="h-5 w-5" />}
          iconClassName="text-amber-600"
        />

        <ReportStatCard
          label="Sin datos historicos"
          value={String(report.sinDatos)}
          hint="Cerrados sin marcas de inicio/cierre"
          icon={<Clock className="h-5 w-5" />}
          iconClassName="text-slate-500"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800">
            Cumplimiento por prioridad
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Solo se evaluan tickets cerrados con SLA y marcas de tiempo.
          </p>
          <ReportTable
            columns={prioridadColumns}
            rows={report.porPrioridad}
            rowKey={(row) => row.nivel}
            emptyMessage="Todavia no hay prioridades SLA configuradas."
          />
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800">
            Incumplimientos principales
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Se muestran hasta 20 tickets, ordenados por mayor exceso.
          </p>
          <ReportTable
            columns={incumplidoColumns}
            rows={report.incumplidos}
            rowKey={(row) => row.id}
            emptyMessage="No hay tickets fuera de SLA."
          />
        </section>
      </div>
    </>
  );
};
