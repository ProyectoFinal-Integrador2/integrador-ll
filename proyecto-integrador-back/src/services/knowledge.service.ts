import {
  conocimientoRepositorio,
  type ConocimientoRepositorio,
} from '../repositories/knowledge.repository';
import { HttpError } from '../utils/httpError';
import type { SesionUsuario } from '../types/auth.types';
import {
  CATEGORIAS_CONOCIMIENTO,
  type ArticuloConocimiento,
  type CrearArticuloInput,
} from '../types/knowledge.types';

const LONGITUD_MINIMA_TITULO = 3;

export class ConocimientoServicio {
  constructor(
    private readonly repositorio: ConocimientoRepositorio = conocimientoRepositorio,
  ) {}

  async listar(): Promise<ArticuloConocimiento[]> {
    return this.repositorio.listar();
  }

  /**
   * Cada apertura del detalle suma una vista. Se hace con un UPDATE atomico
   * (no leer-sumar-guardar) para que dos usuarios abriendo a la vez no pierdan
   * una visita.
   */
  async registrarVista(id: string): Promise<ArticuloConocimiento> {
    const articulo = await this.repositorio.registrarVista(id);

    if (!articulo) {
      throw HttpError.notFound('Articulo de conocimiento no encontrado.');
    }

    return articulo;
  }

  /** El autor se toma de la sesion: el articulo nunca manda quien lo escribe. */
  async crear(
    input: Partial<CrearArticuloInput>,
    sesion?: SesionUsuario,
  ): Promise<ArticuloConocimiento> {
    const titulo = input.titulo?.trim() ?? '';

    if (titulo.length < LONGITUD_MINIMA_TITULO) {
      throw HttpError.badRequest(
        `El titulo debe tener al menos ${LONGITUD_MINIMA_TITULO} caracteres.`,
      );
    }

    const categoria = input.categoria;

    if (!categoria || !CATEGORIAS_CONOCIMIENTO.includes(categoria)) {
      throw HttpError.badRequest('La categoria no es valida.');
    }

    const contenido =
      typeof input.contenido === 'string' && input.contenido.trim().length > 0
        ? input.contenido.trim()
        : null;

    if (!sesion?.id) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    return this.repositorio.crear({ titulo, categoria, contenido }, sesion.id);
  }
}

export const conocimientoServicio = new ConocimientoServicio();