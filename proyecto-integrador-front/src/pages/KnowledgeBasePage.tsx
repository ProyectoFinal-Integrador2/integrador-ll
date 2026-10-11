import { useEffect, useMemo, useState } from 'react';
import { KnowledgeCard } from '@/components/conocimiento/KnowledgeCard';
import { KnowledgeFilters } from '@/components/conocimiento/KnowledgeFilters';
import { KnowledgeToolbar } from '@/components/conocimiento/KnowledgeToolbar';
import { RegisterArticleModal } from '@/components/conocimiento/RegisterArticleModal';
import { crearArticulo, obtenerArticulos } from '@/services/knowledgeApi';
import { normalizarParaBusqueda } from '@/utils/text';
import { TODAS_CATEGORIAS, FILTROS_CONOCIMIENTO, type ArticuloConocimiento, type EntradaArticuloConocimiento, type FiltroConocimiento } from '@/types/knowledge.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const KnowledgeBasePage = () => {
  const [articles, setArticles] = useState<ArticuloConocimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FiltroConocimiento>(
    TODAS_CATEGORIAS,
  );

  useEffect(() => {
    const controller = new AbortController();

    obtenerArticulos(controller.signal)
      .then((data) => {
        setArticles(data);
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

    obtenerArticulos()
      .then((data) => {
        setArticles(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const handleCreate = async (input: EntradaArticuloConocimiento) => {
    const creado = await crearArticulo(input);
    setArticles((prev) => [creado, ...prev]);
    setError(null);
  };

  const searched = useMemo(() => {
    const query = normalizarParaBusqueda(searchTerm);
    if (query.length === 0) return articles;

    return articles.filter((article) =>
      [article.titulo, article.autorNombre, article.categoria]
        .map(normalizarParaBusqueda)
        .some((field) => field.includes(query)),
    );
  }, [articles, searchTerm]);

  const counts = useMemo(() => {
    const result = {} as Record<FiltroConocimiento, number>;

    for (const filter of FILTROS_CONOCIMIENTO) {
      result[filter] =
        filter === TODAS_CATEGORIAS
          ? searched.length
          : searched.filter((article) => article.categoria === filter).length;
    }

    return result;
  }, [searched]);

  const visibleArticles = useMemo(
    () =>
      activeFilter === TODAS_CATEGORIAS
        ? searched
        : searched.filter((article) => article.categoria === activeFilter),
    [activeFilter, searched],
  );

  const hasActiveSearch = normalizarParaBusqueda(searchTerm).length > 0;

  return (
    <div className="w-full">
      <KnowledgeToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onOpenNewArticle={() => setIsNewArticleModalOpen(true)}
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
            {hasActiveSearch || activeFilter !== TODAS_CATEGORIAS
              ? 'Sin coincidencias'
              : 'Sin articulos'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {hasActiveSearch || activeFilter !== TODAS_CATEGORIAS
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

      <RegisterArticleModal
        key={`nuevo-${isNewArticleModalOpen}`}
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};