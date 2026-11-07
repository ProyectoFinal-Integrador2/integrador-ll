import { Eye, User, X } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import { ESTILOS_CATEGORIA_CONOCIMIENTO } from '@/components/conocimiento/knowledgeCategoryStyles';
import { formatearFecha } from '@/utils/date';
import type { ArticuloConocimiento } from '@/types/knowledge.types';

interface KnowledgeDetailModalProps {
  article: ArticuloConocimiento | null;
  onClose: () => void;
}

export const KnowledgeDetailModal = ({
  article,
  onClose,
}: KnowledgeDetailModalProps) => (
  <BaseModal isOpen={article !== null} onClose={onClose} maxWidth="max-w-2xl">
    {article && (
      <>
        <div className="flex items-start justify-between gap-4">
          <span
            className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${ESTILOS_CATEGORIA_CONOCIMIENTO[article.categoria]}`}
          >
            {article.categoria}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-800 md:text-xl">
          {article.titulo}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            {article.autorNombre}
          </span>

          <span aria-hidden="true">&middot;</span>

          <span>{formatearFecha(article.creadoEn)}</span>

          <span aria-hidden="true">&middot;</span>

          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {article.vistas} {article.vistas === 1 ? 'vista' : 'vistas'}
          </span>
        </div>

        <p className="mt-5 max-h-[55vh] overflow-y-auto whitespace-pre-line rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {article.contenido?.trim() ||
            'Este articulo no tiene contenido adicional.'}
        </p>
      </>
    )}
  </BaseModal>
);
