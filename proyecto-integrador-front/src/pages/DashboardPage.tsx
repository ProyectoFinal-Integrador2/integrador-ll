import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { JefeDashboardView } from '@/components/dashboard/JefeDashboardView';
import { TecnicoDashboardView } from '@/components/dashboard/TecnicoDashboardView';
import { UsuarioDashboardView } from '@/components/dashboard/UsuarioDashboardView';
import { TicketDetailModal } from '@/components/tickets/TicketDetailModal';
import { useSession } from '@/context/session';
import { obtenerDashboard } from '@/services/dashboardApi';
import { cambiarEstadoTicket } from '@/services/ticketsApi';
import type { ReporteDashboard } from '@/types/dashboard.types';
import type { Ticket, EstadoTicket } from '@/types/ticket.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const DashboardPage = () => {
  const { user } = useSession();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReporteDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const isTecnico = user?.rol === 'Técnico';
  const isUsuario = user?.rol === 'Usuario';

  const technicianId = isTecnico ? user?.id : undefined;
  const userId = isUsuario ? user?.id : undefined;

  useEffect(() => {
    const controller = new AbortController();

    obtenerDashboard(controller.signal, technicianId, userId)
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
  }, [technicianId, userId]);

  const handleRefresh = () => {
    setIsLoading(true);

    obtenerDashboard(undefined, technicianId, userId)
      .then((data) => {
        setReport(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const reloadQuietly = useCallback(() => {
    obtenerDashboard(undefined, technicianId, userId)
      .then((data) => setReport(data))
      .catch(() => {
      });
  }, [technicianId, userId]);

  const handleChangeStatus = async (ticket: Ticket, estado: EstadoTicket) => {
    const updated = await cambiarEstadoTicket(ticket.id, estado);

    setSelectedTicket((prev) => (prev?.id === updated.id ? updated : prev));
    reloadQuietly();
  };

  const handleEvaluate = (ticket: Ticket) => {
    setSelectedTicket(null);
    navigate('/evaluaciones', { state: { ticketId: ticket.id } });
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-end">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label="Actualizar dashboard"
          title="Actualizar dashboard"
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
            No se pudo cargar el dashboard
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      ) : isLoading || !report ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm text-slate-500">Cargando dashboard...</p>
        </div>
      ) : report.alcance === 'jefe' ? (
        <JefeDashboardView report={report} onSelectTicket={setSelectedTicket} />
      ) : report.alcance === 'tecnico' ? (
        <TecnicoDashboardView report={report} onSelectTicket={setSelectedTicket} />
      ) : (
        <UsuarioDashboardView report={report} onSelectTicket={setSelectedTicket} />
      )}

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onChangeStatus={handleChangeStatus}
        onEvaluate={handleEvaluate}
      />
    </div>
  );
};