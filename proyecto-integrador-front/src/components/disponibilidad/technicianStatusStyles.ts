import type { EstadoTecnico } from '../../types/availability.types';

export const ESTILOS_ESTADO_TECNICO: Record<EstadoTecnico, string> = {
  Libre: 'bg-green-500',
  Ocupado: 'bg-red-500',
  Parcial: 'bg-orange-400',
};