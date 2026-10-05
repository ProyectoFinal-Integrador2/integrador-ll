import { slaRepository, type SlaRepository } from '../repositories/sla.repository';
import { HttpError } from '../utils/httpError';
import {
  SLA_LEVELS,
  type CreateSlaPriorityInput,
  type SlaLevel,
  type SlaPriority,
  type UpdateSlaPriorityInput,
} from '../types/sla.types';

/** Nadie espera mas de una semana por un ticket. */
const MAX_MINUTES = 7 * 24 * 60;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type UntrustedSlaInput = Partial<CreateSlaPriorityInput & UpdateSlaPriorityInput>;

/**
 * De mas a menos urgente: SLA_LEVELS ya viene en ese orden, asi que el indice
 * de cada nivel sirve como clave de ordenamiento.
 *
 * Exportado porque el dashboard tambien muestra los SLA y necesita la misma
 * politica; duplicar el sort serian dos lugares que se desalinean.
 */
export const sortSlaByUrgency = (priorities: SlaPriority[]): SlaPriority[] =>
  [...priorities].sort(
    (a, b) => SLA_LEVELS.indexOf(a.level) - SLA_LEVELS.indexOf(b.level),
  );

export class SlaService {
  constructor(private readonly repository: SlaRepository) {}

  async list(): Promise<SlaPriority[]> {
    return sortSlaByUrgency(await this.repository.findAll());
  }

  async create(input: UntrustedSlaInput): Promise<SlaPriority> {
    const level = this.requireLevel(input.level);

    return this.repository.create(this.buildPayload(input, level));
  }

  async update(id: string, input: UntrustedSlaInput): Promise<SlaPriority> {
    const current = await this.repository.findById(id);

    if (!current) {
      throw HttpError.notFound(`No existe una prioridad SLA con id ${id}.`);
    }

    const level = this.requireLevel(input.level);
    const updated = await this.repository.update(
      id,
      this.buildPayload(input, level),
    );

    if (!updated) {
      throw HttpError.notFound(`No existe una prioridad SLA con id ${id}.`);
    }

    return updated;
  }

  /** Valida los tres tiempos y devuelve el payload ya acotado al dominio. */
  private buildPayload(
    input: UntrustedSlaInput,
    level: SlaLevel,
  ): CreateSlaPriorityInput {
    const description = input.description?.trim() ?? '';

    if (description.length < 10) {
      throw HttpError.badRequest(
        'La descripcion debe tener al menos 10 caracteres.',
      );
    }

    const responseMinutes = this.requireMinutes(
      input.responseMinutes,
      'El tiempo de respuesta',
    );
    const resolutionMinutes = this.requireMinutes(
      input.resolutionMinutes,
      'El tiempo de resolucion',
    );
    const escalationMinutes = this.requireMinutes(
      input.escalationMinutes,
      'El tiempo de escalamiento',
    );

    // Resolver antes de responder no tiene sentido, y un SLA asi no sirve
    // para medir cumplimiento en HU20.
    if (responseMinutes >= resolutionMinutes) {
      throw HttpError.badRequest(
        'El tiempo de respuesta debe ser menor que el de resolucion.',
      );
    }

    return {
      level,
      description,
      responseMinutes,
      resolutionMinutes,
      escalationMinutes,
    };
  }

  private requireLevel(value: SlaLevel | undefined): SlaLevel {
    if (!value || !SLA_LEVELS.includes(value)) {
      throw HttpError.badRequest('El nivel no es valido.');
    }

    return value;
  }

  /**
   * Acepta el `0` del escalamiento ("de inmediato") pero no negativos sueltos
   * ni decimales: los minutos se comparan entre si en el reporte de HU20.
   */
  private requireMinutes(value: number | undefined, field: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw HttpError.badRequest(`${field} debe ser un numero de minutos.`);
    }

    if (!Number.isInteger(value) || value < 0) {
      throw HttpError.badRequest(`${field} debe ser un entero de 0 a ${MAX_MINUTES}.`);
    }

    if (value > MAX_MINUTES) {
      throw HttpError.badRequest(`${field} no puede superar ${MAX_MINUTES} minutos.`);
    }

    return value;
  }
}

export const slaService = new SlaService(slaRepository);