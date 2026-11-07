import { Server, Ticket, TriangleAlert } from 'lucide-react';
import { ReportActions } from '@/components/reportes/ReportActions';
import { ReportBarList } from '@/components/reportes/ReportBarList';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { ReportError, ReportLoading } from '@/components/reportes/ReportState';
import { ReportTable, type ReportColumn } from '@/components/reportes/ReportTable';
import { ESTILOS_ESTADO_EQUIPO } from '@/components/equipos/equipmentStyles';
import { useReporte } from '@/hooks/useReporte';
import { obtenerReporteFallas } from '@/services/reportsApi';
import { formatearFecha } from '@/utils/date';
import type { FallaEquipo, RebanadaReporte } from '@/types/report.types';

const criticosDe = (equipo: FallaEquipo): number =>
  equipo.porPrioridad.find((prioridad) => prioridad.etiqueta === 'Crítico')
    ?.conteo ?? 0;

const columns: ReportColumn<FallaEquipo>[] = [
  {
    header: 'Equipo',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-700">
          {row.codigo} - {row.nombre}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">{row.area}</p>
      </div>
    ),
  },
  {
    header: 'Estado',
    render: (row) => (
      <span
        className={`rounded px-2 py-0.5 text-[11px] font-bold ${ESTILOS_ESTADO_EQUIPO[row.estado]}`}
      >
        {row.estado}
      </span>
    ),
  },
  { header: 'Tickets', render: (row) => row.tickets },
  {
    header: 'Abiertos',
    render: (row) => (
      <span className="font-semibold text-amber-600">{row.abiertos}</span>
    ),
  },
  { header: 'Cerrados', render: (row) => row.cerrados },
  {
    header: 'Criticos',
    render: (row) => (
      <span
        className={
          criticosDe(row) > 0 ? 'font-semibold text-red-600' : 'text-slate-400'
        }
      >
        {criticosDe(row)}
      </span>
    ),
  },
  {
    header: 'Ultima falla',
    render: (row) =>
      row.ultimaFallaEn ? formatearFecha(row.ultimaFallaEn) : 'Sin incidencias',
  },
];

const aRebanadas = (equipos: FallaEquipo[]): RebanadaReporte[] => {
  const conFallas = equipos.filter((equipo) => equipo.tickets > 0);
  const total = conFallas.reduce((acc, equipo) => acc + equipo.tickets, 0);

  return conFallas.slice(0, 5).map((equipo) => ({
    etiqueta: equipo.codigo,
    conteo: equipo.tickets,
    porcentaje: total === 0 ? 0 : Math.round((equipo.tickets / total) * 100),
  }));
};

export const EquipmentFailureReport = () => {
  const { data: report, isLoading, error } = useReporte(obtenerReporteFallas);

  if (error) return <ReportError message={error} />;
  if (isLoading || !report) return <ReportLoading />;

  const conEquipo = report.totalTickets - report.ticketsSinEquipo;

  return (
    <>
      <ReportActions
        filename="reporte-fallas-equipos"
        sections={[
          {
            titulo: 'Resumen de fallas',
            columnas: ['Indicador', 'Valor'],
            filas: [
              ['Tickets totales', report.totalTickets],
              ['Tickets con equipo', conEquipo],
              ['Tickets sin equipo', report.ticketsSinEquipo],
              [
                'Equipos con fallas',
                report.equipos.filter((equipo) => equipo.tickets > 0).length,
              ],
              ['Generado en', report.generadoEn],
            ],
          },
          {
            titulo: 'Historial por equipo',
            columnas: [
              'Codigo',
              'Equipo',
              'Area',
              'Estado',
              'Tickets',
              'Abiertos',
              'Cerrados',
              'Criticos',
              'Ultima falla',
            ],
            filas: report.equipos.map((equipo) => [
              equipo.codigo,
              equipo.nombre,
              equipo.area,
              equipo.estado,
              equipo.tickets,
              equipo.abiertos,
              equipo.cerrados,
              criticosDe(equipo),
              equipo.ultimaFallaEn ?? 'Sin incidencias',
            ]),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard
          label="Tickets totales"
          value={String(report.totalTickets)}
          hint="Incidencias registradas"
          icon={<Ticket className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Con equipo"
          value={String(conEquipo)}
          hint="Incidencias asociadas a un equipo"
          icon={<Server className="h-5 w-5" />}
          iconClassName="text-green-600"
        />

        <ReportStatCard
          label="Sin equipo"
          value={String(report.ticketsSinEquipo)}
          hint="No permiten atribuir la falla"
          icon={<TriangleAlert className="h-5 w-5" />}
          iconClassName="text-amber-600"
        />

        <ReportStatCard
          label="Equipos con fallas"
          value={String(report.equipos.filter((equipo) => equipo.tickets > 0).length)}
          hint={`${report.equipos.length} equipos en inventario`}
          icon={<Server className="h-5 w-5" />}
          iconClassName="text-blue-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReportBarList
            title="Equipos con mas incidencias"
            slices={aRebanadas(report.equipos)}
            colorFor={() => 'bg-red-500'}
            emptyMessage="Todavia no hay incidencias asociadas a equipos."
          />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800">
            Historial por equipo
          </h3>
          <ReportTable
            columns={columns}
            rows={report.equipos}
            rowKey={(row) => row.id}
            emptyMessage="Todavia no hay equipos registrados."
          />
        </section>
      </div>
    </>
  );
};
