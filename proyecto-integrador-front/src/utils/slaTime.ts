/**
 * Pasa minutos a texto legible: 45 -> "45 min", 60 -> "1 h", 90 -> "1 h 30 min",
 * 1440 -> "24 h".
 *
 * Vive en utils y no en el componente porque lo usan la tabla y los dos
 * formularios, y duplicar el redondeo en tres lugares es como aparecen
 * "1 hora" junto a "60 min" en la misma pantalla.
 */
export const formatMinutes = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes < 0) return '—';
  if (minutes === 0) return 'Inmediato';

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;

  return `${hours} h ${rest} min`;
};

/** Para el `<input type="number">`: los minutos como numero editable. */
export const toMinutesInput = (minutes: number): number =>
  Number.isFinite(minutes) && minutes >= 0 ? minutes : 0;