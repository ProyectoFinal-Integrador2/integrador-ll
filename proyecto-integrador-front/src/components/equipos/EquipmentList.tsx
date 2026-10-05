import { SquarePen } from 'lucide-react';
import { EQUIPMENT_TYPE_ICONS } from '@/constants/equipmentStyles';
import type { Equipment } from '@/types/equipment.types';
import { EquipmentStatusBadge } from '@/components/equipos/EquipmentStatusBadge';

interface EquipmentListProps {
  equipments: Equipment[];
  onEditEquipment?: (equipment: Equipment) => void;
  isLoading: boolean;
  error: string | null;
}

export const EquipmentList = ({
  equipments,
  onEditEquipment,
  isLoading,
  error,
}: EquipmentListProps) => {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="text-sm font-semibold text-red-700">No se pudieron cargar los equipos</p>
        <p className="mt-1 text-xs text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm text-slate-500">Cargando equipos...</p>
      </div>
    );
  }

  if (equipments.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-700">Sin equipos</p>
        <p className="mt-1 text-xs text-slate-400">
          Ningun equipo coincide con la busqueda o el filtro seleccionado.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {equipments.map((equipment) => {
        const TypeIcon = EQUIPMENT_TYPE_ICONS[equipment.type];

        return (
          <li
            key={equipment.id}
            className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xs transition-colors hover:bg-slate-50/70 sm:grid-cols-[11rem_1fr_10rem_9rem_6rem] sm:gap-4"
          >
            <div className="flex items-center gap-3">
              <TypeIcon className="h-5 w-5 shrink-0 text-slate-400" />
              <span className="text-xs font-bold text-slate-400">{equipment.code}</span>
            </div>

            <span className="text-sm font-semibold text-slate-800">
              {equipment.name}
            </span>

            <span className="text-xs text-slate-500 sm:text-sm sm:text-slate-600">
              {equipment.area}
            </span>

            <span>
              <EquipmentStatusBadge status={equipment.status} />
            </span>

            <span className="sm:text-right">
              <button
                type="button"
                onClick={() => onEditEquipment?.(equipment)}
                aria-label={`Editar equipo ${equipment.code}`}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <SquarePen className="h-3.5 w-3.5" />
                Editar
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
};