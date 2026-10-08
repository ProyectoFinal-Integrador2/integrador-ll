import { query } from '../config/db';
import type {
  DisponibilidadTecnico,
  EstadoTecnico,
} from '../types/availability.types';
import { SIN_HORARIO } from '../types/availability.types';
import type { EstadoUsuario, RolUsuario } from '../types/user.types';
import { COLOR_AVATAR_POR_ROL, inicialesDeNombre } from '../utils/avatar';

interface FilaDisponibilidad {
  id: number;
  nombre: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  horario: string | null;
  tickets_activos: number | null;
  estado_disponibilidad: EstadoTecnico | null;
}

export interface DisponibilidadRepositorio {
  listar(): Promise<DisponibilidadTecnico[]>;
}

/**
 * La disponibilidad solo lista tecnicos activos: si un tecnico no tiene una
 * fila en `disponibilidad`, se muestra con horario por defecto, sin tickets y
 * como Libre.
 */
export class PostgresDisponibilidadRepositorio
  implements DisponibilidadRepositorio
{
  async listar(): Promise<DisponibilidadTecnico[]> {
    const filas = await query<FilaDisponibilidad>(
      `select
         u.id,
         u.nombre,
         u.rol,
         u.estado,
         d.horario,
         d.tickets_activos,
         d.estado as estado_disponibilidad
       from usuarios u
       left join disponibilidad d on d.usuario_id = u.id
       where u.rol = 'Técnico' and u.estado = 'Activo'
       order by u.nombre asc, u.id asc`,
    );

    return filas.map((fila) => ({
      id: String(fila.id),
      nombre: fila.nombre,
      avatarIniciales: inicialesDeNombre(fila.nombre),
      colorAvatar: COLOR_AVATAR_POR_ROL[fila.rol],
      horario: fila.horario ?? SIN_HORARIO,
      ticketsActivos: fila.tickets_activos ?? 0,
      estado: fila.estado_disponibilidad ?? 'Libre',
    }));
  }
}

export const disponibilidadRepositorio = new PostgresDisponibilidadRepositorio();