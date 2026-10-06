
export const formatMinutes = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes < 0) return '—';
  if (minutes === 0) return 'Inmediato';

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;

  return `${hours} h ${rest} min`;
};

export const toMinutesInput = (minutes: number): number =>
  Number.isFinite(minutes) && minutes >= 0 ? minutes : 0;