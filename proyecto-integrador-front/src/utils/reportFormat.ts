export const formatearMinutos = (minutos: number | null): string => {
  if (minutos === null) return 'Sin datos';
  if (minutos < 60) return `${Math.round(minutos)} min`;

  const horas = Math.floor(minutos / 60);
  const resto = Math.round(minutos % 60);

  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
};

export const formatearPorcentaje = (valor: number | null): string =>
  valor === null ? 'Sin datos' : `${valor}%`;

export const formatearPromedio = (valor: number | null): string =>
  valor === null ? 'Sin datos' : `${valor} / 5`;
