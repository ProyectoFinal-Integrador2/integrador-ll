export interface CsvSeccion {
  titulo: string;
  columnas: string[];
  filas: Array<Array<string | number | null | undefined>>;
}

const escaparCelda = (valor: string | number | null | undefined): string => {
  if (valor === null || valor === undefined) return '';

  const texto = String(valor);

  return /[",\n\r;]/.test(texto)
    ? `"${texto.replace(/"/g, '""')}"`
    : texto;
};

const aLinea = (celdas: Array<string | number | null | undefined>): string =>
  celdas.map(escaparCelda).join(',');

/**
 * Genera el CSV en el navegador: no hace falta una libreria ni un endpoint
 * extra. El BOM inicial hace que Excel respete las tildes.
 */
export const descargarCsv = (
  nombreArchivo: string,
  secciones: CsvSeccion[],
): void => {
  const lineas: string[] = [];

  for (const seccion of secciones) {
    if (lineas.length > 0) lineas.push('');

    lineas.push(escaparCelda(seccion.titulo));
    lineas.push(aLinea(seccion.columnas));

    for (const fila of seccion.filas) lineas.push(aLinea(fila));
  }

  const contenido = `\uFEFF${lineas.join('\r\n')}`;
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo.endsWith('.csv')
    ? nombreArchivo
    : `${nombreArchivo}.csv`;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};
