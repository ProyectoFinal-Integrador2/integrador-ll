/**
 * Rellenos solidos para las barras del reporte.
 *
 * No se puede reusar `TICKET_PRIORITY_STYLES`: ahi el color viene en un badge
 * con fondo claro y texto oscuro, y una barra con `bg-red-100` sobre blanco no se
 * ve. Se mantiene la misma familia de color para que "Critico" sea rojo en las
 * dos pantallas.
 */
export const TICKET_PRIORITY_BAR_STYLES: Record<string, string> = {
  Crítico: 'bg-red-500',
  Alto: 'bg-orange-500',
  Medio: 'bg-blue-500',
  Bajo: 'bg-green-500',
};

export const TICKET_STATUS_BAR_STYLES: Record<string, string> = {
  Abierto: 'bg-blue-500',
  'En progreso': 'bg-amber-500',
  Cerrado: 'bg-green-500',
  Cancelado: 'bg-rose-400',
};

/** Todas las barras de estrellas usan el mismo amarillo. */
export const RATING_BAR_STYLE = 'bg-yellow-400';
