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
  tickets_activos: number;
}

export interface DisponibilidadRepositorio {
  listar(): Promise<DisponibilidadTecnico[]>;
}

const estadoSegunCarga = (ticketsActivos: number): EstadoTecnico =>
  ticketsActivos > 0 ? 'Ocupado' : 'Libre';
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
         (
           select count(*)::int
           from tickets t
           where t.tecnico_id = u.id and t.estado = 'En progreso'
         ) as tickets_activos
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
      ticketsActivos: fila.tickets_activos,
      estado: estadoSegunCarga(fila.tickets_activos),
    }));
  }
}

export const disponibilidadRepositorio = new PostgresDisponibilidadRepositorio();