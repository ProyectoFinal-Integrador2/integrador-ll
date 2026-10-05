import { useEffect, useMemo, useState } from 'react';
import { KnowledgeCard } from '@/components/conocimiento/KnowledgeCard';
import { KnowledgeFilters } from '@/components/conocimiento/KnowledgeFilters';
import { KnowledgeToolbar } from '@/components/conocimiento/KnowledgeToolbar';
import { fetchKnowledgeArticles } from '@/services/knowledgeApi';
import { normalizeForSearch } from '@/utils/text';
import {
  ALL_CATEGORIES,
  KNOWLEDGE_FILTERS,
  type KnowledgeArticle,
  type KnowledgeFilter,
} from '@/types/knowledge.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const KnowledgeBasePage = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<KnowledgeFilter>(
    ALL_CATEGORIES,
  );

  /**
   * Los setState van dentro de los callbacks de la promesa, nunca en el cuerpo
   * del efecto: llamarlos de forma sincrona ahi provoca renders en cascada.
   */
  useEffect(() => {
    const controller = new AbortController();

    fetchKnowledgeArticles(controller.signal)
      .then((data) => {
        setArticles(data);
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

    fetchKnowledgeArticles()
      .then((data) => {
        setArticles(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const searched = useMemo(() => {
    const query = normalizeForSearch(searchTerm);
    if (query.length === 0) return articles;

    return articles.filter((article) =>
      [article.title, article.authorName, article.category]
        .map(normalizeForSearch)
        .some((field) => field.includes(query)),
    );
  }, [articles, searchTerm]);

  /** Los contadores responden a la busqueda: al buscar "wifi" tiene que verse
      cuantos articulos hay de cada categoria, no el total de la biblioteca. */
  const counts = useMemo(() => {
    const result = {} as Record<KnowledgeFilter, number>;

    for (const filter of KNOWLEDGE_FILTERS) {
      result[filter] =
        filter === ALL_CATEGORIES
          ? searched.length
          : searched.filter((article) => article.category === filter).length;
    }

    return result;
  }, [searched]);

  const visibleArticles = useMemo(
    () =>
      activeFilter === ALL_CATEGORIES
        ? searched
        : searched.filter((article) => article.category === activeFilter),
    [activeFilter, searched],
  );

  const hasActiveSearch = normalizeForSearch(searchTerm).length > 0;

  return (
    <div className="w-full">
      <KnowledgeToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="my-4">
        <KnowledgeFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <p className="text-sm font-semibold text-red-700">
            No se pudieron cargar los articulos
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm text-slate-500">Cargando articulos...</p>
        </div>
      ) : visibleArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm font-semibold text-slate-700">
            {hasActiveSearch || activeFilter !== ALL_CATEGORIES
              ? 'Sin coincidencias'
              : 'Sin articulos'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {hasActiveSearch || activeFilter !== ALL_CATEGORIES
              ? 'Ningun articulo coincide con los filtros aplicados.'
              : 'Todavia no se publico ningun articulo.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleArticles.map((article) => (
            <KnowledgeCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};