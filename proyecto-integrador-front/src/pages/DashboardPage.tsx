import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { JefeDashboardView } from '@/components/dashboard/JefeDashboardView';
import { TecnicoDashboardView } from '@/components/dashboard/TecnicoDashboardView';
import { UsuarioDashboardView } from '@/components/dashboard/UsuarioDashboardView';
import { TicketDetailModal } from '@/components/tickets/TicketDetailModal';
import { useSession } from '@/context/session';
import { fetchDashboard } from '@/services/dashboardApi';
import { changeTicketStatus } from '@/services/ticketsApi';
import type { DashboardReport } from '@/types/dashboard.types';
import type { Ticket, TicketStatus } from '@/types/ticket.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

/**
 * Lectura de lo que ya existe: cada panel consume el modulo que le corresponde
 * (tickets, disponibilidad, SLA, evaluaciones), asi que cuando estos datos
 * pasen a base de datos el backend sigue siendo el unico lugar que cambia.
 *
 * El contenido depende del rol: el Jefe TI ve la vista global, el tecnico la
 * suya y el solicitante solo sus propios tickets. El backend lo decide segun el
 * `scope` que devuelve, asi que la pagina no arma la vista: solo la pide.
 */
export const DashboardPage = () => {
  const { user } = useSession();
  const navigate = useNavigate();

  const [report, setReport] = useState<DashboardReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const isTecnico = user?.role === 'Técnico';
  const isUsuario = user?.role === 'Usuario';

  // Solo uno de los dos viaja: el backend prioriza el `technicianId`.
  const technicianId = isTecnico ? user?.id : undefined;
  const userId = isUsuario ? user?.id : undefined;

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboard(controller.signal, technicianId, userId)
      .then((data) => {
        setReport(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        // Un abort es lo normal al desmontar o recargar: no es un fallo que mostrar.
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

    fetchDashboard(undefined, technicianId, userId)
      .then((data) => {
        setReport(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  /**
   * Recarga sin pasar por el esqueleto. Se usa despues de mover un ticket: los
   * KPIs y el grafico del dashboard vienen calculados en el servidor, asi que
   * parchear el ticket en el estado local dejaria los contadores desfasados.
   */
  const reloadQuietly = useCallback(() => {
    fetchDashboard(undefined, technicianId, userId)
      .then((data) => setReport(data))
      .catch(() => {
        // Si falla, el modal ya mostro el error del cambio de estado: no se
        // reemplaza toda la pantalla por un aviso de un modulo que no cambio.
      });
  }, [technicianId, userId]);

  const handleChangeStatus = async (ticket: Ticket, status: TicketStatus) => {
    const updated = await changeTicketStatus(ticket.id, status);

    // El modal queda abierto, asi que su ticket tiene que reflejar el cambio.
    setSelectedTicket((prev) => (prev?.id === updated.id ? updated : prev));
    reloadQuietly();
  };

  /**
   * "Dar conformidad" deja el ticket para el formulario de evaluacion. Se pasa
   * el ticket por `state` para que la pantalla lo muestre primero, en vez de
   * dejarlo escondido en la lista.
   */
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
      ) : report.scope === 'jefe' ? (
        <JefeDashboardView report={report} onSelectTicket={setSelectedTicket} />
      ) : report.scope === 'tecnico' ? (
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