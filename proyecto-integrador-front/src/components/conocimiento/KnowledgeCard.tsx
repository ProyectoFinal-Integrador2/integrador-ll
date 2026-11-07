import type { KeyboardEvent } from 'react';
import { Eye, User } from 'lucide-react';
import { ESTILOS_CATEGORIA_CONOCIMIENTO } from '@/components/conocimiento/knowledgeCategoryStyles';
import { formatearFecha } from '@/utils/date';
import type { ArticuloConocimiento } from '@/types/knowledge.types';

interface KnowledgeCardProps {
  article: ArticuloConocimiento;
  onOpen: (article: ArticuloConocimiento) => void;
}

export const KnowledgeCard = ({ article, onOpen }: KnowledgeCardProps) => {
  const { titulo, contenido, categoria, autorNombre, vistas, creadoEn } = article;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(article);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(article)}
      onKeyDown={handleKeyDown}
      title="Ver detalle"
      className="cursor-pointer rounded-xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:border-blue-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span
        className={`mb-3 inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${ESTILOS_CATEGORIA_CONOCIMIENTO[categoria]}`}
      >
        {categoria}
      </span>

      <h3 className="text-[15px] font-semibold text-slate-800">{titulo}</h3>

      {contenido && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {contenido}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          {autorNombre}
        </span>

        <span aria-hidden="true">&middot;</span>

        <span>{formatearFecha(creadoEn)}</span>

        <span aria-hidden="true">&middot;</span>

        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          {vistas} {vistas === 1 ? 'vista' : 'vistas'}
        </span>
      </div>
    </article>
  );
};