import { useEffect, useState, type ReactNode } from 'react';
import {BadgeCheck, CheckCircle2,Loader2,PlayCircle,Ban,X,} from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import { TICKET_PRIORITY_STYLES, TICKET_STATUS_STYLES } from '@/utils/ticketStyles';
import { fetchSlaPriorities } from '@/services/slasApi';
import { fetchServiceEvaluations } from '@/services/evaluationsApi';
import { useSession } from '@/context/session';
import { formatDate } from '@/utils/date';
import { formatMinutes } from '@/utils/slaTime';
import type { SlaPriority } from '@/types/sla.types';
import type { Ticket, TicketStatus } from '@/types/ticket.types';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onChangeStatus?: (ticket: Ticket, status: TicketStatus) => Promise<void>;
  onEvaluate?: (ticket: Ticket) => void;
}

const PENDING = 'No registrado';

const InfoRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <p>
    <span className="font-medium text-slate-500">{label}: </span>
    {children}
  </p>
);

export const TicketDetailModal = ({
  ticket,
  onClose,
  onChangeStatus,
  onEvaluate,
}: TicketDetailModalProps) => {
  const { user } = useSession();

  const [sla, setSla] = useState<SlaPriority[]>([]);
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewedTicketId, setReviewedTicketId] = useState<string | null>(null);

  const isOpen = ticket !== null;
  const isReviewed = ticket !== null && reviewedTicketId === ticket.id;

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    fetchSlaPriorities(controller.signal)
      .then(setSla)
      .catch(() => {
        setSla([]);
      });

    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !ticket || user?.role !== 'Usuario') return;

    const controller = new AbortController();

    fetchServiceEvaluations(controller.signal)
      .then((evaluations) => {
        const reviewed = evaluations.some(
          (evaluation) =>
            evaluation.ticketId === ticket.id && evaluation.reviewerId === user.id,
        );

        if (reviewed) setReviewedTicketId(ticket.id);
      })
      .catch(() => {
      });

    return () => controller.abort();
  }, [isOpen, ticket, user]);

  const slaLimit = ticket ? sla.find((item) => item.level === ticket.priority) : undefined;
  const isTecnico = user?.role === 'Técnico';
  const isOwner = user?.role === 'Usuario' && ticket?.userId === user?.id;
  const canAct = onChangeStatus !== undefined;
  const actionHint = isTecnico
    ? ticket?.status === 'Cerrado' || ticket?.status === 'Cancelado'
      ? `Este ticket ya esta ${ticket.status.toLowerCase()}: no admite mas cambios de estado.`
      : ticket?.status === 'Abierto'
        ? 'Podés iniciar el soporte para tomar el ticket.'
        : 'Cuando termines, culminá el reporte para cerrarlo.'
    : isOwner
      ? ticket?.status === 'Cancelado'
        ? 'Cancelaste este ticket: ya no admite mas cambios.'
        : ticket?.status === 'Cerrado'
          ? isReviewed
            ? 'Ya diste conformidad a este ticket.'
            : 'Podés dar conformidad al servicio que recibiste.'
          : 'Podés cancelar el ticket mientras nadie lo atienda.'
      : 'Cancelar y dar conformidad son acciones del rol Usuario sobre sus propios tickets.';

  const handleChangeStatus = async (status: TicketStatus) => {
    if (!ticket || !onChangeStatus) return;

    setPendingStatus(status);
    setActionError(null);

    try {
      await onChangeStatus(ticket, status);
    } catch (changeError) {
      setActionError(
        changeError instanceof Error
          ? changeError.message
          : 'No se pudo actualizar el ticket',
      );
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[600px]">
      {ticket && (
        <>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 md:text-xl">
              Ticket #{ticket.id}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-base leading-relaxed font-semibold text-slate-800">
            {ticket.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2.5 py-1 text-xs font-bold ${TICKET_PRIORITY_STYLES[ticket.priority]}`}
            >
              Prioridad: {ticket.priority}
            </span>

            <span
              className={`rounded px-2.5 py-1 text-xs font-bold ${TICKET_STATUS_STYLES[ticket.status]}`}
            >
              {ticket.status}
            </span>

            <span className="rounded bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">
              Tecnico:{' '}
              {ticket.technicianName ?? (
                <span className="font-normal text-slate-400">Sin asignar</span>
              )}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700 sm:grid-cols-2 sm:gap-x-4">
            <div className="flex flex-col gap-3">
              <InfoRow label="Usuario">{ticket.user}</InfoRow>
              <InfoRow label="Apertura">{formatDate(ticket.createdAt)}</InfoRow>
              <InfoRow label="Equipo">
                <span className="text-slate-400">{PENDING}</span>
              </InfoRow>
            </div>

            <div className="flex flex-col gap-3">
              <InfoRow label="Area">
                <span className="text-slate-400">{PENDING}</span>
              </InfoRow>

              <InfoRow label="SLA limite">
                {slaLimit ? (
                  <span className="font-bold text-orange-600">
                    {formatMinutes(slaLimit.resolutionMinutes)}
                  </span>
                ) : (
                  <span className="text-slate-400">Sin SLA configurado</span>
                )}
              </InfoRow>

              <InfoRow label="Categoria">
                <span className="text-slate-400">{PENDING}</span>
              </InfoRow>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isTecnico ? (
              <>
                <button
                  type="button"
                  onClick={() => handleChangeStatus('En progreso')}
                  disabled={
                    !canAct ||
                    ticket.status !== 'Abierto' ||
                    pendingStatus !== null
                  }
                  title={
                    ticket.status !== 'Abierto'
                      ? ticket.status === 'Cerrado'
                        ? 'El ticket ya esta cerrado.'
                        : 'El soporte ya esta iniciado.'
                      : 'Solo el tecnico puede iniciar el soporte.'
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors enabled:cursor-pointer enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pendingStatus === 'En progreso' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  Iniciar soporte
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeStatus('Cerrado')}
                  disabled={
                    !canAct ||
                    ticket.status !== 'En progreso' ||
                    pendingStatus !== null
                  }
                  title={
                    ticket.status === 'Abierto'
                      ? 'Primero tenes que iniciar el soporte.'
                      : ticket.status === 'Cancelado'
                        ? 'El ticket esta cancelado.'
                        : ticket.status === 'Cerrado'
                          ? 'El ticket ya esta cerrado.'
                          : 'Solo el tecnico puede culminar el soporte.'
                  }
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors enabled:cursor-pointer enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pendingStatus === 'Cerrado' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Culminar reporte
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleChangeStatus('Cancelado')}
                  disabled={
                    !canAct ||
                    !isOwner ||
                    ticket.status !== 'Abierto' ||
                    pendingStatus !== null
                  }
                  title={
                    !isOwner
                      ? 'Solo el solicitante puede cancelar su ticket.'
                      : ticket.status !== 'Abierto'
                        ? 'Solo se puede cancelar un ticket abierto.'
                        : 'Cancelar el ticket si ya no lo necesitas.'
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors enabled:cursor-pointer enabled:hover:bg-rose-50 enabled:hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pendingStatus === 'Cancelado' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4" />
                  )}
                  Cancelar ticket
                </button>

                <button
                  type="button"
                  onClick={() => onEvaluate?.(ticket)}
                  disabled={
                    !isOwner ||
                    ticket.status !== 'Cerrado' ||
                    isReviewed ||
                    onEvaluate === undefined
                  }
                  title={
                    !isOwner
                      ? 'Solo el solicitante puede calificar su ticket.'
                      : isReviewed
                        ? 'Ya diste conformidad a este ticket.'
                        : ticket.status !== 'Cerrado'
                          ? 'Se puede conformar cuando el soporte termine.'
                          : 'Calificar la atención recibida.'
                  }
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors enabled:cursor-pointer enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Dar conformidad
                </button>
              </>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            {actionHint}
          </p>

          {actionError && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700"
            >
              {actionError}
            </p>
          )}
        </>
      )}
    </BaseModal>
  );
};