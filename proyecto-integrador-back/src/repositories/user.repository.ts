import { query, queryOne } from '../config/db';
import type {
  ActualizarUsuarioInput,
  CrearUsuarioInput,
  EstadoUsuario,
  RolUsuario,
  Usuario,
} from '../types/user.types';
import { COLOR_AVATAR_POR_ROL, inicialesDeNombre } from '../utils/avatar';

interface FilaUsuario {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  estado: EstadoUsuario;
  fono: string | null;
  debe_cambiar_contrasena: boolean;
}

/** Traduce la fila de Postgres a la entidad del dominio. */
const aDominio = (fila: FilaUsuario): Usuario => ({
  id: String(fila.id),
  nombre: fila.nombre,
  correo: fila.correo,
  rol: fila.rol,
  area: fila.area,
  estado: fila.estado,
  fono: fila.fono,
  debeCambiarContrasena: fila.debe_cambiar_contrasena,
  avatarIniciales: inicialesDeNombre(fila.nombre),
  colorAvatar: COLOR_AVATAR_POR_ROL[fila.rol],
});

const COLUMNAS = 'id, nombre, correo, rol, area, estado, fono, debe_cambiar_contrasena';

export interface UsuarioRepositorio {
  listar(): Promise<Usuario[]>;
  obtenerPorId(id: string): Promise<Usuario | undefined>;
  obtenerCredencialPorCorreo(
    correo: string,
  ): Promise<{ usuario: Usuario; passwordHash: string } | undefined>;
  obtenerPasswordHash(id: string): Promise<string | undefined>;
  actualizarPasswordHash(id: string, passwordHash: string, debeCambiar?: boolean): Promise<boolean>;
  crear(input: CrearUsuarioInput, passwordHash: string): Promise<Usuario>;
  actualizar(
    id: string,
    input: ActualizarUsuarioInput,
  ): Promise<Usuario | undefined>;
  actualizarPerfil(id: string, input: { nombre: string; area: string }): Promise<Usuario | undefined>;
}

export class PostgresUsuarioRepositorio implements UsuarioRepositorio {
  async listar(): Promise<Usuario[]> {
    const filas = await query<FilaUsuario>(`select ${COLUMNAS} from usuarios`);
    return filas.map(aDominio);
  }

  async obtenerPorId(id: string): Promise<Usuario | undefined> {
    const fila = await queryOne<FilaUsuario>(
      `select ${COLUMNAS} from usuarios where id = $1`,
      [Number(id)],
    );
    return fila ? aDominio(fila) : undefined;
  }

  async obtenerCredencialPorCorreo(
    correo: string,
  ): Promise<{ usuario: Usuario; passwordHash: string } | undefined> {
    const fila = await queryOne<FilaUsuario & { password_hash: string }>(
      `select ${COLUMNAS}, password_hash from usuarios where correo = $1`,
      [correo],
    );
    if (!fila) return undefined;
    return { usuario: aDominio(fila), passwordHash: fila.password_hash };
  }

  async obtenerPasswordHash(id: string): Promise<string | undefined> {
    const fila = await queryOne<{ password_hash: string }>(
      `select password_hash from usuarios where id = $1`,
      [Number(id)],
    );
    return fila?.password_hash;
  }

  async actualizarPasswordHash(
    id: string,
    passwordHash: string,
    debeCambiar = false,
  ): Promise<boolean> {
    const filas = await query<{ id: number }>(
      `update usuarios set password_hash = $2, debe_cambiar_contrasena = $3
       where id = $1 returning id`,
      [Number(id), passwordHash, debeCambiar],
    );
    return filas.length === 1;
  }

  async crear(input: CrearUsuarioInput, passwordHash: string): Promise<Usuario> {
    const fila = await queryOne<FilaUsuario>(
      `insert into usuarios (nombre, correo, rol, area, estado, fono, password_hash, debe_cambiar_contrasena)
       values ($1, $2, $3, $4, 'Activo', $5, $6, true)
       returning ${COLUMNAS}`,
      [input.nombre, input.correo, input.rol, input.area, input.fono, passwordHash],
    );

    if (!fila) throw new Error('No se pudo crear el usuario.');
    return aDominio(fila);
  }

  async actualizar(
    id: string,
    input: ActualizarUsuarioInput,
  ): Promise<Usuario | undefined> {
    const fila = await queryOne<FilaUsuario>(
      `update usuarios
       set nombre = $2, correo = $3, rol = $4, estado = $5
       where id = $1
       returning ${COLUMNAS}`,
      [Number(id), input.nombre, input.correo, input.rol, input.estado],
    );

    return fila ? aDominio(fila) : undefined;
  }

  async actualizarPerfil(
    id: string,
    input: { nombre: string; area: string },
  ): Promise<Usuario | undefined> {
    const fila = await queryOne<FilaUsuario>(
      `update usuarios
       set nombre = $2, area = $3
       where id = $1
       returning ${COLUMNAS}`,
      [Number(id), input.nombre, input.area],
    );

    return fila ? aDominio(fila) : undefined;
  }
}

export const usuarioRepositorio = new PostgresUsuarioRepositorio();