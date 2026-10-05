import { Eye, User } from 'lucide-react';
import { KNOWLEDGE_CATEGORY_STYLES } from '@/constants/knowledgeCategoryStyles';
import { formatDate } from '@/utils/date';
import type { KnowledgeArticle } from '@/types/knowledge.types';

interface KnowledgeCardProps {
  article: KnowledgeArticle;
}

export const KnowledgeCard = ({ article }: KnowledgeCardProps) => {
  const { title, category, authorName, views, createdAt } = article;

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
      {/* Etiqueta de categoria */}
      <span
        className={`mb-3 inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${KNOWLEDGE_CATEGORY_STYLES[category]}`}
      >
        {category}
      </span>

      <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>

      {/* Autor, fecha y vistas */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          {authorName}
        </span>

        <span aria-hidden="true">&middot;</span>

        <span>{formatDate(createdAt)}</span>

        <span aria-hidden="true">&middot;</span>

        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          {views} {views === 1 ? 'vista' : 'vistas'}
        </span>
      </div>
    </article>
  );
};