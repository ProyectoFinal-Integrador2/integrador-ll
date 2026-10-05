/**
 * Formateador en un solo lugar: las fechas llegan del back como ISO 8601 y cada
 * pantalla que las muestra necesita el mismo formato `es-PE`.
 *
 * Vive en utils porque lo usan la lista de tickets y la de evaluaciones; con
 * una copia dentro de cada componente, dos pantallas pueden terminar mostrando
 * la misma fecha de forma distinta.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const formatDate = (iso: string): string =>
  DATE_FORMATTER.format(new Date(iso));