import { ClipboardList, Star, Timer, UserRoundCheck } from 'lucide-react';
import { RecentTicketsPanel } from '@/components/reportes/RecentTicketsPanel';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { SlaCommitmentPanel } from '@/components/sla/SlaCommitmentPanel';
import { TecnicoEvaluationsPanel } from '@/components/evaluaciones/TecnicoEvaluationsPanel';
import { TecnicoStatusPanel } from '@/components/disponibilidad/TecnicoStatusPanel';
import type { ReporteDashboardTecnico } from '@/types/dashboard.types';
import type { Ticket } from '@/types/ticket.types';

interface TecnicoDashboardViewProps {
  report: ReporteDashboardTecnico;
  onSelectTicket: (ticket: Ticket) => void;
}

export const TecnicoDashboardView = ({
  report,
  onSelectTicket,
}: TecnicoDashboardViewProps) => {
  const { tecnico, satisfaccion } = report;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard
          label="Mi estado"
          value={tecnico.estado}
          hint={tecnico.horario}
          icon={<UserRoundCheck className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Tickets activos"
          value={String(tecnico.ticketsActivos)}
          hint={
            tecnico.ticketsActivos === 1
              ? '1 ticket en curso'
              : `${tecnico.ticketsActivos} tickets en curso`
          }
          icon={<Timer className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />

        <ReportStatCard
          label="Mi calificacion"
          value={
            satisfaccion.promedioPuntuacion === null
              ? 'Sin datos'
              : `${satisfaccion.promedioPuntuacion} / 5`
          }
          hint={`Promedio de ${satisfaccion.total} evaluacion${
            satisfaccion.total === 1 ? '' : 'es'
          }`}
          icon={<Star className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />

        <ReportStatCard
          label="Evaluaciones recibidas"
          value={String(satisfaccion.total)}
          hint="Calificaciones de los tickets que atendiste"
          icon={<ClipboardList className="h-5 w-5" />}
          iconClassName="text-indigo-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TecnicoEvaluationsPanel evaluations={report.evaluaciones} />
        </div>

        <RecentTicketsPanel
          title="Tickets sin cerrar"
          tickets={report.ticketsPendientes}
          onSelectTicket={onSelectTicket}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TecnicoStatusPanel technician={tecnico} />

        <SlaCommitmentPanel sla={report.sla} />
      </div>
    </>
  );
};