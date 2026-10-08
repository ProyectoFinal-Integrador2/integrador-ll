export const formatearMinutos = (minutos: number): string => {
  if (!Number.isFinite(minutos) || minutos < 0) return '—';
  if (minutos === 0) return 'Inmediato';

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) return `${resto} min`;
  if (resto === 0) return `${horas} h`;

  return `${horas} h ${resto} min`;
};

export const aEntradaMinutos = (minutos: number): number =>
  Number.isFinite(minutos) && minutos >= 0 ? minutos : 0;