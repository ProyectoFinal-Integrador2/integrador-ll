import { useEffect, useState, type ReactNode } from 'react';
import {BadgeCheck, CheckCircle2,Loader2,PlayCircle,Ban,X,} from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import { ESTILOS_PRIORIDAD, ESTILOS_ESTADO } from '@/utils/ticketStyles';
import { obtenerSlaPrioridades } from '@/services/slasApi';
import { obtenerEvaluaciones } from '@/services/evaluationsApi';
import { useSession } from '@/context/session';
import { formatearFecha } from '@/utils/date';
import { formatearMinutos } from '@/utils/slaTime';
import type { SlaPrioridad } from '@/types/sla.types';
import type { Ticket, EstadoTicket } from '@/types/ticket.types';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onChangeStatus?: (ticket: Ticket, status: EstadoTicket) => Promise<void>;
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

  const [sla, setSla] = useState<SlaPrioridad[]>([]);
  const [pendingStatus, setPendingStatus] = useState<EstadoTicket | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewedTicketId, setReviewedTicketId] = useState<string | null>(null);

  const isOpen = ticket !== null;
  const isReviewed = ticket !== null && reviewedTicketId === ticket.id;

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    obtenerSlaPrioridades(controller.signal)
      .then(setSla)
      .catch(() => {
        setSla([]);
      });

    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !ticket || user?.rol !== 'Usuario') return;

    const controller = new AbortController();

    obtenerEvaluaciones(controller.signal)
      .then((evaluations) => {
        const reviewed = evaluations.some(
          (evaluation) =>
            evaluation.idTicket === ticket.id && evaluation.idEvaluador === user.id,
        );

        if (reviewed) setReviewedTicketId(ticket.id);
      })
      .catch(() => {
      });

    return () => controller.abort();
  }, [isOpen, ticket, user]);

  const slaLimit = ticket ? sla.find((item) => item.nivel === ticket.prioridad) : undefined;
  const isTecnico = user?.rol === 'Técnico';
  const isOwner = user?.rol === 'Usuario' && ticket?.usuarioId === user?.id;
  const canAct = onChangeStatus !== undefined;
  const actionHint = isTecnico
    ? ticket?.estado === 'Cerrado' || ticket?.estado === 'Cancelado'
      ? `Este ticket ya esta ${ticket.estado.toLowerCase()}: no admite mas cambios de estado.`
      : ticket?.estado === 'Abierto'
        ? 'Podés iniciar el soporte para tomar el ticket.'
        : 'Cuando termines, culminá el reporte para cerrarlo.'
    : isOwner
      ? ticket?.estado === 'Cancelado'
        ? 'Cancelaste este ticket: ya no admite mas cambios.'
        : ticket?.estado === 'Cerrado'
          ? isReviewed
            ? 'Ya diste conformidad a este ticket.'
            : 'Podés dar conformidad al servicio que recibiste.'
          : 'Podés cancelar el ticket mientras nadie lo atienda.'
      : 'Cancelar y dar conformidad son acciones del rol Usuario sobre sus propios tickets.';

  const handleChangeStatus = async (estado: EstadoTicket) => {
    if (!ticket || !onChangeStatus) return;

    setPendingStatus(estado);
    setActionError(null);

    try {
      await onChangeStatus(ticket, estado);
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
            {ticket.descripcion}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2.5 py-1 text-xs font-bold ${ESTILOS_PRIORIDAD[ticket.prioridad]}`}
            >
              Prioridad: {ticket.prioridad}
            </span>

            <span
              className={`rounded px-2.5 py-1 text-xs font-bold ${ESTILOS_ESTADO[ticket.estado]}`}
            >
              {ticket.estado}
            </span>

            <span className="rounded bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">
              Tecnico:{' '}
              {ticket.tecnicoNombre ?? (
                <span className="font-normal text-slate-400">Sin asignar</span>
              )}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700 sm:grid-cols-2 sm:gap-x-4">
            <div className="flex flex-col gap-3">
              <InfoRow label="Usuario">{ticket.solicitante}</InfoRow>
              <InfoRow label="Apertura">{formatearFecha(ticket.creadoEn)}</InfoRow>
              <InfoRow label="Equipo">
                {ticket.equipoId ? (
                  <span>
                    {ticket.equipoCodigo ? `${ticket.equipoCodigo} - ` : ''}
                    {ticket.equipoNombre ?? ticket.equipoId}
                  </span>
                ) : (
                  <span className="text-slate-400">Sin asignar</span>
                )}
              </InfoRow>
            </div>

            <div className="flex flex-col gap-3">
              <InfoRow label="Area">
                {ticket.area ? (
                  <span>{ticket.area}</span>
                ) : (
                  <span className="text-slate-400">{PENDING}</span>
                )}
              </InfoRow>

              <InfoRow label="SLA limite">
                {slaLimit ? (
                  <span className="font-bold text-orange-600">
                    {formatearMinutos(slaLimit.minutosResolucion)}
                  </span>
                ) : (
                  <span className="text-slate-400">Sin SLA configurado</span>
                )}
              </InfoRow>

              <InfoRow label="SLA asignado">
                {slaLimit ? (
                  <span>
                    {slaLimit.nivel} - Resp:{' '}
                    {formatearMinutos(slaLimit.minutosRespuesta)} - Resol:{' '}
                    {formatearMinutos(slaLimit.minutosResolucion)} - Escal:{' '}
                    {formatearMinutos(slaLimit.minutosEscalamiento)}
                    {slaLimit.descripcion ? ` - ${slaLimit.descripcion}` : ''}
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
                    ticket.estado !== 'Abierto' ||
                    pendingStatus !== null
                  }
                  title={
                    ticket.estado !== 'Abierto'
                      ? ticket.estado === 'Cerrado'
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
                    ticket.estado !== 'En progreso' ||
                    pendingStatus !== null
                  }
                  title={
                    ticket.estado === 'Abierto'
                      ? 'Primero tenes que iniciar el soporte.'
                      : ticket.estado === 'Cancelado'
                        ? 'El ticket esta cancelado.'
                        : ticket.estado === 'Cerrado'
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
                    ticket.estado !== 'Abierto' ||
                    pendingStatus !== null
                  }
                  title={
                    !isOwner
                      ? 'Solo el solicitante puede cancelar su ticket.'
                      : ticket.estado !== 'Abierto'
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
                    ticket.estado !== 'Cerrado' ||
                    isReviewed ||
                    onEvaluate === undefined
                  }
                  title={
                    !isOwner
                      ? 'Solo el solicitante puede calificar su ticket.'
                      : isReviewed
                        ? 'Ya diste conformidad a este ticket.'
                        : ticket.estado !== 'Cerrado'
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