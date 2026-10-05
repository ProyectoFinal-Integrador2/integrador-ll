import { useEffect, useMemo, useState } from 'react';
import { TicketFilters } from '@/components/TicketFilters';
import { TicketsToolbar } from '@/components/TicketsToolbar';
import { TicketList } from '@/components/TicketList';
import { CreateTicketModal } from '@/components/CreateTicketModal';
import { createTicket, fetchTickets } from '@/services/ticketsApi';
import { normalizeForSearch } from '@/utils/text';
import type { CreateTicketInput, Ticket, TicketFilter } from '@/types/ticket.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TicketFilter>('todos');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

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

      <TicketList tickets={visibleTickets} isLoading={isLoading} error={error} />

      <CreateTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};
