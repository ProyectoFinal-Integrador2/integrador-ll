import { CircleCheckBig, Star, Ticket as TicketIcon, Timer } from 'lucide-react';
import { RecentTicketsPanel } from '@/components/reportes/RecentTicketsPanel';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { SlaCommitmentPanel } from '@/components/sla/SlaCommitmentPanel';
import { TechnicianAvailabilityPanel } from '@/components/disponibilidad/TechnicianAvailabilityPanel';
import { WeeklyTicketsChart } from '@/components/reportes/WeeklyTicketsChart';
import type { JefeDashboardReport } from '@/types/dashboard.types';
import type { Ticket } from '@/types/ticket.types';

interface JefeDashboardViewProps {
  report: JefeDashboardReport;
  onSelectTicket: (ticket: Ticket) => void;
}

const pluralize = (total: number, singular: string, plural: string): string =>
  `${total} ${total === 1 ? singular : plural}`;

/** Vista global: la que administra el Jefe TI. */
export const JefeDashboardView = ({
  report,
  onSelectTicket,
}: JefeDashboardViewProps) => {
  const busyCount = report.tickets.open + report.tickets.inProgress;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard
          label="Tickets abiertos"
          value={String(report.tickets.open)}
          hint={
            report.tickets.total === 0
              ? 'Sin tickets registrados'
              : `${Math.round(
                  (report.tickets.open / report.tickets.total) * 100,
                )}% del total`
          }
          icon={<TicketIcon className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Tickets en progreso"
          value={String(report.tickets.inProgress)}
          hint={pluralize(busyCount, 'ticket activo', 'tickets activos')}
          icon={<Timer className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />

        {/*
          El prototipo decia "Cerrados hoy". `Ticket` no tiene `closedAt`, solo
          `createdAt`, asi que no hay forma de saber cuando se cerro: se muestra
          el total cerrado en lugar de un "hoy" inventado.
        */}
        <ReportStatCard
          label="Tickets cerrados"
          value={String(report.tickets.closed)}
          hint={
            report.tickets.total === 0
              ? 'Sin tickets registrados'
              : `${Math.round(
                  (report.tickets.closed / report.tickets.total) * 100,
                )}% del total`
          }
          icon={<CircleCheckBig className="h-5 w-5" />}
          iconClassName="text-green-600"
        />

        <ReportStatCard
          label="Satisfaccion"
          value={
            report.satisfaction.averageRating === null
              ? 'Sin datos'
              : `${report.satisfaction.averageRating} / 5`
          }
          hint={pluralize(
            report.satisfaction.total,
            'evaluacion registrada',
            'evaluaciones registradas',
          )}
          icon={<Star className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 2 de 3 columnas: la lista necesita ancho para el titulo. */}
        <div className="lg:col-span-2">
          <RecentTicketsPanel
            tickets={report.tickets.recent}
            onSelectTicket={onSelectTicket}
          />
        </div>

        <WeeklyTicketsChart
          week={report.tickets.week}
          statusTotals={{
            Abierto: report.tickets.open,
            'En progreso': report.tickets.inProgress,
            Cerrado: report.tickets.closed,
            Cancelado: report.tickets.cancelled,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TechnicianAvailabilityPanel technicians={report.technicians} />

        <SlaCommitmentPanel sla={report.sla} />
      </div>
    </>
  );
};