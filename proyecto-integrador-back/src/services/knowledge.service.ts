import {
  conocimientoRepositorio,
  type ConocimientoRepositorio,
} from '../repositories/knowledge.repository';
import type { ArticuloConocimiento } from '../types/knowledge.types';

export class ConocimientoServicio {
  constructor(
    private readonly repositorio: ConocimientoRepositorio = conocimientoRepositorio,
  ) {}

  /**
   * Solo lectura: no hay alta de articulos todavia, asi que no hay nada que
   * validar. El filtro por categoria y el buscador viven en el frontend porque
   * son de presentacion.
   */
  async listar(): Promise<ArticuloConocimiento[]> {
    return this.repositorio.listar();
  }
}

export const conocimientoServicio = new ConocimientoServicio();