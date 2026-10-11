import {
  equipoRepositorio,
  type EquipoRepositorio,
} from '../repositories/equipment.repository';
import { HttpError } from '../utils/httpError';
import {
  ESTADOS_EQUIPO,
  TIPOS_EQUIPO,
  type ActualizarEquipoInput,
  type CrearEquipoInput,
  type Equipo,
  type EstadoEquipo,
  type TipoEquipo,
} from '../types/equipment.types';

/** Codigo de inventario: dos o tres letras, guion y al menos un digito. */
const PATRON_CODIGO = /^[A-Za-z]{2,3}-\d{1,4}$/;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type EntradaEquipoSinValidar = Partial<CrearEquipoInput & ActualizarEquipoInput>;

export class EquipoServicio {
  constructor(private readonly repositorio: EquipoRepositorio) {}

  async listar(): Promise<Equipo[]> {
    const equipos = await this.repositorio.listar();
    return [...equipos].sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  async crear(input: EntradaEquipoSinValidar): Promise<Equipo> {
    const codigo = this.exigirCodigo(input.codigo);

    await this.asegurarCodigoLibre(codigo);

    return this.repositorio.crear({
      codigo,
      nombre: this.exigirNombre(input.nombre),
      area: this.exigirArea(input.area),
      tipo: this.exigirTipo(input.tipo),
    });
  }

  async actualizar(id: string, input: EntradaEquipoSinValidar): Promise<Equipo> {
    const actual = await this.repositorio.obtenerPorId(id);

    if (!actual) {
      throw HttpError.notFound(`No existe un equipo con id ${id}.`);
    }

    const codigo = this.exigirCodigo(input.codigo);

    // El codigo es la identidad: no puede repetir, salvo sobre el propio
    // equipo que se esta editando.
    await this.asegurarCodigoLibre(codigo, id);

    const actualizado = await this.repositorio.actualizar(id, {
      codigo,
      nombre: this.exigirNombre(input.nombre),
      area: this.exigirArea(input.area),
      tipo: this.exigirTipo(input.tipo),
      estado: this.exigirEstado(input.estado),
    });

    if (!actualizado) {
      throw HttpError.notFound(`No existe un equipo con id ${id}.`);
    }

    return actualizado;
  }

  private exigirNombre(value: string | undefined): string {
    const nombre = value?.trim() ?? '';

    if (nombre.length < 3) {
      throw HttpError.badRequest('El nombre debe tener al menos 3 caracteres.');
    }

    return nombre;
  }

  private exigirArea(value: string | undefined): string {
    const area = value?.trim() ?? '';

    if (area.length === 0) {
      throw HttpError.badRequest('El area es obligatoria.');
    }

    return area;
  }

  /** El codigo se guarda en mayusculas para que LT-01 y lt-01 no coexistan. */
  private exigirCodigo(value: string | undefined): string {
    const codigo = value?.trim().toUpperCase() ?? '';

    if (!PATRON_CODIGO.test(codigo)) {
      throw HttpError.badRequest(
        'El codigo debe tener el formato XY-000 (ej. LT-014).',
      );
    }

    return codigo;
  }

  private exigirTipo(value: TipoEquipo | undefined): TipoEquipo {
    if (!value || !TIPOS_EQUIPO.includes(value)) {
      throw HttpError.badRequest('El tipo de equipo no es valido.');
    }

    return value;
  }

  private exigirEstado(value: EstadoEquipo | undefined): EstadoEquipo {
    if (!value || !ESTADOS_EQUIPO.includes(value)) {
      throw HttpError.badRequest('El estado no es valido.');
    }

    return value;
  }

  /** Lanza 409 si el codigo ya pertenece a otro equipo. */
  private async asegurarCodigoLibre(codigo: string, exceptoId?: string): Promise<void> {
    const equipos = await this.repositorio.listar();
    const ocupado = equipos.some(
      (equipo) => equipo.codigo === codigo && equipo.id !== exceptoId,
    );

    if (ocupado) {
      throw new HttpError(409, 'Ya existe un equipo con ese codigo.');
    }
  }
}

export const equipoServicio = new EquipoServicio(equipoRepositorio);