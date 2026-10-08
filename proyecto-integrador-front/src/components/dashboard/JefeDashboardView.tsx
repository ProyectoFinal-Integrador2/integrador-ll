import { CircleCheckBig, Star, Ticket as TicketIcon, Timer } from 'lucide-react';
import { RecentTicketsPanel } from '@/components/reportes/RecentTicketsPanel';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { SlaCommitmentPanel } from '@/components/sla/SlaCommitmentPanel';
import { TechnicianAvailabilityPanel } from '@/components/disponibilidad/TechnicianAvailabilityPanel';
import { WeeklyTicketsChart } from '@/components/reportes/WeeklyTicketsChart';
import type { ReporteDashboardJefe } from '@/types/dashboard.types';
import type { Ticket } from '@/types/ticket.types';

interface JefeDashboardViewProps {
  report: ReporteDashboardJefe;
  onSelectTicket: (ticket: Ticket) => void;
}

const pluralize = (total: number, singular: string, plural: string): string =>
  `${total} ${total === 1 ? singular : plural}`;

export const JefeDashboardView = ({
  report,
  onSelectTicket,
}: JefeDashboardViewProps) => {
  const busyCount = report.tickets.abiertos + report.tickets.enProgreso;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard
          label="Tickets abiertos"
          value={String(report.tickets.abiertos)}
          hint={
            report.tickets.total === 0
              ? 'Sin tickets registrados'
              : `${Math.round(
                  (report.tickets.abiertos / report.tickets.total) * 100,
                )}% del total`
          }
          icon={<TicketIcon className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Tickets en progreso"
          value={String(report.tickets.enProgreso)}
          hint={pluralize(busyCount, 'ticket activo', 'tickets activos')}
          icon={<Timer className="h-5 w-5" />}
          iconClassName="text-yellow-500"
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
          label="Satisfaccion"
          value={
            report.satisfaccion.promedioPuntuacion === null
              ? 'Sin datos'
              : `${report.satisfaccion.promedioPuntuacion} / 5`
          }
          hint={pluralize(
            report.satisfaccion.total,
            'evaluacion registrada',
            'evaluaciones registradas',
          )}
          icon={<Star className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTicketsPanel
            tickets={report.tickets.recientes}
            onSelectTicket={onSelectTicket}
          />
        </div>

        <WeeklyTicketsChart
          week={report.tickets.semana}
          statusTotals={{
            Abierto: report.tickets.abiertos,
            'En progreso': report.tickets.enProgreso,
            Cerrado: report.tickets.cerrados,
            Cancelado: report.tickets.cancelados,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TechnicianAvailabilityPanel technicians={report.tecnicos} />

        <SlaCommitmentPanel sla={report.sla} />
      </div>
    </>
  );
};