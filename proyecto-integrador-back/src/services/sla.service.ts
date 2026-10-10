import {
  slaRepositorio,
  type SlaRepositorio,
} from '../repositories/sla.repository';
import { HttpError } from '../utils/httpError';
import {
  NIVELES_SLA,
  type ActualizarSlaPrioridadInput,
  type CrearSlaPrioridadInput,
  type NivelSla,
  type SlaPrioridad,
} from '../types/sla.types';

/** Nadie espera mas de una semana por un ticket. */
const MAX_MINUTOS = 7 * 24 * 60;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type EntradaSlaSinValidar = Partial<CrearSlaPrioridadInput & ActualizarSlaPrioridadInput>;

/**
 * De mas a menos urgente: NIVELES_SLA ya viene en ese orden, asi que el indice
 * de cada nivel sirve como clave de ordenamiento.
 *
 * Exportado porque el dashboard tambien muestra los SLA y necesita la misma
 * politica; duplicar el sort serian dos lugares que se desalinean.
 */
export const ordenarSlaPorUrgencia = (prioridades: SlaPrioridad[]): SlaPrioridad[] =>
  [...prioridades].sort(
    (a, b) => NIVELES_SLA.indexOf(a.nivel) - NIVELES_SLA.indexOf(b.nivel),
  );

export class SlaServicio {
  constructor(private readonly repositorio: SlaRepositorio) {}

  async listar(): Promise<SlaPrioridad[]> {
    return ordenarSlaPorUrgencia(await this.repositorio.listar());
  }

  async crear(input: EntradaSlaSinValidar): Promise<SlaPrioridad> {
    const nivel = this.exigirNivel(input.nivel);

    return this.repositorio.crear(this.construirPayload(input, nivel));
  }

  async actualizar(id: string, input: EntradaSlaSinValidar): Promise<SlaPrioridad> {
    const actual = await this.repositorio.obtenerPorId(id);

    if (!actual) {
      throw HttpError.notFound(`No existe una prioridad SLA con id ${id}.`);
    }

    const nivel = this.exigirNivel(input.nivel);
    const actualizado = await this.repositorio.actualizar(
      id,
      this.construirPayload(input, nivel),
    );

    if (!actualizado) {
      throw HttpError.notFound(`No existe una prioridad SLA con id ${id}.`);
    }

    return actualizado;
  }

  /** Valida los tres tiempos y devuelve el payload ya acotado al dominio. */
  private construirPayload(
    input: EntradaSlaSinValidar,
    nivel: NivelSla,
  ): CrearSlaPrioridadInput {
    const descripcion = input.descripcion?.trim() ?? '';

    if (descripcion.length < 10) {
      throw HttpError.badRequest(
        'La descripcion debe tener al menos 10 caracteres.',
      );
    }

    const minutosRespuesta = this.exigirMinutos(
      input.minutosRespuesta,
      'El tiempo de respuesta',
    );
    const minutosResolucion = this.exigirMinutos(
      input.minutosResolucion,
      'El tiempo de resolucion',
    );
    const minutosEscalamiento = this.exigirMinutos(
      input.minutosEscalamiento,
      'El tiempo de escalamiento',
    );

    // Resolver antes de responder no tiene sentido, y un SLA asi no sirve
    // para medir cumplimiento.
    if (minutosRespuesta >= minutosResolucion) {
      throw HttpError.badRequest(
        'El tiempo de respuesta debe ser menor que el de resolucion.',
      );
    }

    return {
      nivel,
      descripcion,
      minutosRespuesta,
      minutosResolucion,
      minutosEscalamiento,
    };
  }

  private exigirNivel(value: NivelSla | undefined): NivelSla {
    if (!value || !NIVELES_SLA.includes(value)) {
      throw HttpError.badRequest('El nivel no es valido.');
    }

    return value;
  }

  /**
   * Acepta el `0` del escalamiento ("de inmediato") pero no negativos sueltos
   * ni decimales: los minutos se comparan entre si en el reporte.
   */
  private exigirMinutos(value: number | undefined, campo: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw HttpError.badRequest(`${campo} debe ser un numero de minutos.`);
    }

    if (!Number.isInteger(value) || value < 0) {
      throw HttpError.badRequest(`${campo} debe ser un entero de 0 a ${MAX_MINUTOS}.`);
    }

    if (value > MAX_MINUTOS) {
      throw HttpError.badRequest(`${campo} no puede superar ${MAX_MINUTOS} minutos.`);
    }

    return value;
  }
}

export const slaServicio = new SlaServicio(slaRepositorio);