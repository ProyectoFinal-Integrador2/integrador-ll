/**
 * Quita acentos, pasa a minusculas y recorta espacios, para que "tecnico"
 * encuentre a "Tecnico" y "ramirez" a "Ramírez".
 *
 * Vive en scope compartido porque las dos features con buscador (usuarios y
 * tickets) necesitan exactamente la misma normalizacion.
 */
export const normalizeForSearch = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
