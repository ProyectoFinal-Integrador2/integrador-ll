import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  CircleCheckBig,
  Timer,
  Ticket as TicketIcon,
} from 'lucide-react';
import { RecentTicketsPanel } from '@/components/reportes/RecentTicketsPanel';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { SlaCommitmentPanel } from '@/components/sla/SlaCommitmentPanel';
import { WeeklyTicketsChart } from '@/components/reportes/WeeklyTicketsChart';
import type { ReporteDashboardUsuario } from '@/types/dashboard.types';
import type { Ticket } from '@/types/ticket.types';

interface UsuarioDashboardViewProps {
  report: ReporteDashboardUsuario;
  onSelectTicket: (ticket: Ticket) => void;
}

export const UsuarioDashboardView = ({
  report,
  onSelectTicket,
}: UsuarioDashboardViewProps) => {
  const navigate = useNavigate();

  const { tickets, evaluacionesPendientes } = report;
  const activeCount = tickets.abiertos + tickets.enProgreso;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard
          label="Mis tickets"
          value={String(tickets.total)}
          hint="Todos los que pediste"
          icon={<TicketIcon className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Abiertos"
          value={String(tickets.abiertos)}
          hint="Esperando que los tome un técnico"
          icon={<Timer className="h-5 w-5" />}
          iconClassName="text-yellow-500"
        />

        <ReportStatCard
          label="En progreso"
          value={String(tickets.enProgreso)}
          hint={
            activeCount === 1
              ? '1 ticket en curso'
              : `${activeCount} tickets en curso`
          }
          icon={<Timer className="h-5 w-5" />}
          iconClassName="text-blue-600"
        />

        <ReportStatCard
          label="Cerrados"
          value={String(tickets.cerrados)}
          hint={
            evaluacionesPendientes.length === 0
              ? 'Nada pendiente de calificar'
              : `${evaluacionesPendientes.length} por calificar`
          }
          icon={<CircleCheckBig className="h-5 w-5" />}
          iconClassName="text-green-600"
        />
      </div>

      {evaluacionesPendientes.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-amber-600" />

            <p className="text-sm font-semibold text-amber-900">
              Tenés {evaluacionesPendientes.length}{' '}
              {evaluacionesPendientes.length === 1
                ? 'ticket cerrado'
                : 'tickets cerrados'}{' '}
              sin calificar
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/evaluaciones')}
            className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Dar conformidad
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTicketsPanel
            title="Mis ultimos tickets"
            tickets={tickets.recientes}
            onSelectTicket={onSelectTicket}
          />
        </div>

        <WeeklyTicketsChart
          week={tickets.semana}
          statusTotals={{
            Abierto: tickets.abiertos,
            'En progreso': tickets.enProgreso,
            Cerrado: tickets.cerrados,
            Cancelado: tickets.cancelados,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SlaCommitmentPanel sla={report.sla} />
      </div>
    </>
  );
};