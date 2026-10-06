
const DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const formatDate = (iso: string): string =>
  DATE_FORMATTER.format(new Date(iso));