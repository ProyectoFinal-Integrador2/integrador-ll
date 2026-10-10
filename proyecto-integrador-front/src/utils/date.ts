const FORMATEADOR_FECHA = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const formatearFecha = (iso: string): string =>
  FORMATEADOR_FECHA.format(new Date(iso));