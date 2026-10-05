import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketsToolbar } from '@/components/tickets/TicketsToolbar';
import { TicketList } from '@/components/tickets/TicketList';
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal';
import { TicketDetailModal } from '@/components/tickets/TicketDetailModal';
import { useSession } from '@/context/session';
import { changeTicketStatus, createTicket, fetchTickets } from '@/services/ticketsApi';
import { normalizeForSearch } from '@/utils/text';
import type { CreateTicketInput, Ticket, TicketFilter, TicketStatus } from '@/types/ticket.types';

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
  const [activeFilter, setActiveFilter] = useState<TicketFilter>('todos');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  /**
   * Los setState van dentro de los callbacks de la promesa, nunca en el cuerpo
   * del efecto: llamarlos de forma sincrona ahi provoca renders en cascada
   * (`react-hooks/set-state-in-effect`).
   *
   * El URL, el parseo y el formato de error viven en ticketsApi, asi que aqui
   * solo queda el encadenado, que es lo unico que cambia entre carga y refresco.
   */
  useEffect(() => {
    const controller = new AbortController();

    fetchTickets(controller.signal)
      .then((data) => {
        setTickets(data);
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
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);

    fetchTickets()
      .then((data) => {
        setTickets(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const searched = useMemo(() => {
    const query = normalizeForSearch(searchTerm);
    if (query.length === 0) return tickets;

    return tickets.filter((ticket) =>
      [ticket.id, ticket.description, ticket.user, ticket.priority, ticket.status]
        .map(normalizeForSearch)
        .some((field) => field.includes(query)),
    );
  }, [tickets, searchTerm]);

  /** Los contadores responden a la busqueda, pero no al filtro activo: si no,
      al elegir un filtro los demas serian cero y perderian sentido. */
  const counts = useMemo<Record<TicketFilter, number>>(
    () => ({
      todos: searched.length,
      abiertos: searched.filter((t) => t.status === 'Abierto').length,
      'en-progreso': searched.filter((t) => t.status === 'En progreso').length,
      cerrados: searched.filter((t) => t.status === 'Cerrado').length,
      cancelados: searched.filter((t) => t.status === 'Cancelado').length,
      criticos: searched.filter((t) => t.priority === 'Crítico').length,
    }),
    [searched],
  );

  const visibleTickets = useMemo(() => {
    switch (activeFilter) {
      case 'abiertos':
        return searched.filter((t) => t.status === 'Abierto');
      case 'en-progreso':
        return searched.filter((t) => t.status === 'En progreso');
      case 'cerrados':
        return searched.filter((t) => t.status === 'Cerrado');
      case 'cancelados':
        return searched.filter((t) => t.status === 'Cancelado');
      case 'criticos':
        return searched.filter((t) => t.priority === 'Crítico');
      case 'todos':
      default:
        return searched;
    }
  }, [activeFilter, searched]);

  const handleCreate = async (input: CreateTicketInput) => {
    const created = await createTicket(input);
    // El back responde el ticket ya creado, asi que no hay que recargar la lista.
    setTickets((prev) => [created, ...prev]);
  };

  /**
   * El back devuelve el ticket ya movido de estado, asi que se reemplaza en la
   * lista y en el modal en vez de recargar. Si el modal queda abierto, el
   * `status` del ticket seleccionado cambia y los botones se reevaluan solos.
   */
  const handleChangeStatus = async (ticket: Ticket, status: TicketStatus) => {
    const updated = await changeTicketStatus(ticket.id, status);

    setTickets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedTicket((prev) => (prev?.id === updated.id ? updated : prev));
  };

  /** "Dar conformidad" lleva al formulario con el ticket ya elegido. */
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
          user?.role === 'Usuario' ? { nombre: user.name, userId: user.id } : null
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
