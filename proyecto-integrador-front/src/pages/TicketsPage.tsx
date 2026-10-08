import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketsToolbar } from '@/components/tickets/TicketsToolbar';
import { TicketList } from '@/components/tickets/TicketList';
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal';
import { TicketDetailModal } from '@/components/tickets/TicketDetailModal';
import { useSession } from '@/context/session';
import { cambiarEstadoTicket, crearTicket, obtenerTickets } from '@/services/ticketsApi';
import { normalizarParaBusqueda } from '@/utils/text';
import type { CrearTicketInput, Ticket, FiltroTicket, EstadoTicket } from '@/types/ticket.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const TicketsPage = () => {
  const navigate = useNavigate();
  const { user } = useSession();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FiltroTicket>('todos');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    obtenerTickets(controller.signal)
      .then((data) => {
        setTickets(data);
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
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);

    obtenerTickets()
      .then((data) => {
        setTickets(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const searched = useMemo(() => {
    const query = normalizarParaBusqueda(searchTerm);
    if (query.length === 0) return tickets;

    return tickets.filter((ticket) =>
      [ticket.id, ticket.descripcion, ticket.solicitante, ticket.prioridad, ticket.estado]
        .map(normalizarParaBusqueda)
        .some((field) => field.includes(query)),
    );
  }, [tickets, searchTerm]);

  const counts = useMemo<Record<FiltroTicket, number>>(
    () => ({
      todos: searched.length,
      abiertos: searched.filter((t) => t.estado === 'Abierto').length,
      'en-progreso': searched.filter((t) => t.estado === 'En progreso').length,
      cerrados: searched.filter((t) => t.estado === 'Cerrado').length,
      cancelados: searched.filter((t) => t.estado === 'Cancelado').length,
      criticos: searched.filter((t) => t.prioridad === 'Crítico').length,
    }),
    [searched],
  );

  const visibleTickets = useMemo(() => {
    switch (activeFilter) {
      case 'abiertos':
        return searched.filter((t) => t.estado === 'Abierto');
      case 'en-progreso':
        return searched.filter((t) => t.estado === 'En progreso');
      case 'cerrados':
        return searched.filter((t) => t.estado === 'Cerrado');
      case 'cancelados':
        return searched.filter((t) => t.estado === 'Cancelado');
      case 'criticos':
        return searched.filter((t) => t.prioridad === 'Crítico');
      case 'todos':
      default:
        return searched;
    }
  }, [activeFilter, searched]);

  const handleCreate = async (input: CrearTicketInput) => {
    const created = await crearTicket(input);
    setTickets((prev) => [created, ...prev]);
  };

  const handleChangeStatus = async (ticket: Ticket, estado: EstadoTicket) => {
    const updated = await cambiarEstadoTicket(ticket.id, estado);

    setTickets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedTicket((prev) => (prev?.id === updated.id ? updated : prev));
  };

  const handleEvaluate = (ticket: Ticket) => {
    setSelectedTicket(null);
    navigate('/evaluaciones', { state: { ticketId: ticket.id } });
  };

  return (
    <div className="w-full">
      <TicketsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="mb-4">
        <TicketFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </div>

      <TicketList
        tickets={visibleTickets}
        isLoading={isLoading}
        error={error}
        onSelectTicket={setSelectedTicket}
      />

      <CreateTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onCreate={handleCreate}
        solicitante={
          user?.rol === 'Usuario' ? { nombre: user.nombre, userId: user.id } : null
        }
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onChangeStatus={handleChangeStatus}
        onEvaluate={handleEvaluate}
      />
    </div>
  );
};
