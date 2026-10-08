import { SquarePen } from 'lucide-react';
import type { SlaPrioridad } from '@/types/sla.types';
import { formatearMinutos } from '@/utils/slaTime';
import { SlaLevelBadge } from '@/components/sla/SlaLevelBadge';

interface SlaTableProps {
  priorities: SlaPrioridad[];
  onEditPriority?: (priority: SlaPrioridad) => void;
  isLoading: boolean;
  error: string | null;
  hasActiveSearch?: boolean;
}

export const SlaTable = ({
  priorities,
  onEditPriority,
  isLoading,
  error,
  hasActiveSearch = false,
}: SlaTableProps) => {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="text-sm font-semibold text-red-700">
          No se pudieron cargar las prioridades SLA
        </p>
        <p className="mt-1 text-xs text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm text-slate-500">Cargando prioridades SLA...</p>
      </div>
    );
  }

  if (priorities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-700">
          {hasActiveSearch
            ? 'Sin coincidencias'
            : 'Sin prioridades SLA'}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {hasActiveSearch
            ? 'Ninguna prioridad coincide con la busqueda.'
            : 'Todavia no se registro ningun nivel de servicio.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nivel
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Descripcion
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                T. Respuesta
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                T. Resolucion
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                Escalamiento
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                {/* Espacio para acciones */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {priorities.map((priority) => (
              <tr
                key={priority.id}
                className="transition-colors hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-6 py-5">
                  <SlaLevelBadge level={priority.nivel} />
                </td>

                <td className="px-6 py-5 text-sm font-medium text-slate-600">
                  {priority.descripcion}
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-center text-sm text-slate-500">
                  {formatearMinutos(priority.minutosRespuesta)}
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-center text-sm text-slate-500">
                  {formatearMinutos(priority.minutosResolucion)}
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-center text-sm text-slate-500">
                  {formatearMinutos(priority.minutosEscalamiento)}
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-right">
                  <button
                    type="button"
                    onClick={() => onEditPriority?.(priority)}
                    aria-label={`Editar prioridad ${priority.nivel}`}
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};