export const DIAS_SEMANA = [
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
  'Dom',
] as const;

export type DiaSemana = (typeof DIAS_SEMANA)[number];

export interface BloqueHorario {
  id: string;
  etiqueta: string;
  /** El texto corto que entra en el horario generado. */
  texto: string;
}

export const BLOQUES_HORARIOS: BloqueHorario[] = [
  { id: 'manana', etiqueta: 'Mañana 08:00-12:00', texto: '08:00-12:00' },
  { id: 'tarde', etiqueta: 'Tarde 13:00-17:00', texto: '13:00-17:00' },
  { id: 'noche', etiqueta: 'Noche 17:00-21:00', texto: '17:00-21:00' },
];

export type BloqueHorarioId = (typeof BLOQUES_HORARIOS)[number]['id'];

/** Colapsa dias consecutivos a rangos: "Lun-Vie"; los sueltos van con coma. */
const colapsarDias = (dias: DiaSemana[]): string => {
  if (dias.length === 0) return '';

  const seleccionados = new Set(dias);
  const rangos: string[] = [];

  let inicio = 0;
  let fin = 0;

  while (inicio < DIAS_SEMANA.length) {
    while (
      fin < DIAS_SEMANA.length &&
      seleccionados.has(DIAS_SEMANA[fin])
    ) {
      fin += 1;
    }

    if (inicio < fin) {
      const desde = DIAS_SEMANA[inicio];
      const hasta = DIAS_SEMANA[fin - 1];
      rangos.push(fin - inicio >= 2 ? `${desde}-${hasta}` : desde);
    }

    inicio = fin + 1;
    fin = inicio;
  }

  return rangos.join(', ');
};

const textoBloque = (ids: BloqueHorarioId[]): string =>
  BLOQUES_HORARIOS.filter((bloque) => ids.includes(bloque.id))
    .map((bloque) => bloque.texto)
    .join(' / ');

export const construirHorario = (
  dias: DiaSemana[],
  bloques: BloqueHorarioId[],
): string => {
  const parteDias = colapsarDias(dias);
  const parteHoras = textoBloque(bloques);

  if (parteDias.length === 0) return parteHoras;
  if (parteHoras.length === 0) return parteDias;
  return `${parteDias} ${parteHoras}`;
};