import { usuarioRepositorio, type UsuarioRepositorio } from '../repositories/user.repository';
import { HttpError } from '../utils/httpError';
import { hashPassword, verificarPassword } from '../utils/password';
import {
  ROLES_USUARIO,
  type ActualizarUsuarioInput,
  type CrearUsuarioInput,
  type EstadoUsuario,
  type RolUsuario,
  type Usuario,
} from '../types/user.types';

/** Exige parte local y arroba. */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LONGITUD_MINIMA_CONTRASENA = 8;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type EntradaUsuarioSinValidar = Partial<CrearUsuarioInput & ActualizarUsuarioInput>;

export class UsuarioServicio {
  constructor(private readonly repositorio: UsuarioRepositorio) {}

  async listar(): Promise<Usuario[]> {
    const usuarios = await this.repositorio.listar();
    return [...usuarios].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  async crear(input: EntradaUsuarioSinValidar): Promise<Usuario> {
    const nombre = this.exigirNombre(input.nombre);
    const correo = this.exigirCorreo(input.correo);
    const rol = this.exigirRol(input.rol);
    const contrasena = this.exigirContrasena(input.contrasena);

    await this.asegurarCorreoLibre(correo);

    return this.repositorio.crear(
      {
        nombre,
        correo,
        rol,
        area: this.exigirArea(input.area),
      },
      hashPassword(contrasena),
    );
  }

  async actualizarPerfil(
    id: string,
    input: { nombre?: unknown; area?: unknown },
  ): Promise<Usuario> {
    const actualizado = await this.repositorio.actualizarPerfil(id, {
      nombre: this.exigirNombre(typeof input.nombre === 'string' ? input.nombre : undefined),
      area: this.exigirArea(typeof input.area === 'string' ? input.area : undefined),
    });

    if (!actualizado) {
      throw HttpError.notFound(`No existe un usuario con id ${id}.`);
    }

    return actualizado;
  }

  async cambiarContrasena(id: string, actual: string, nueva: string): Promise<void> {
    const hash = await this.repositorio.obtenerPasswordHash(id);

    if (!hash) {
      throw HttpError.notFound(`No existe un usuario con id ${id}.`);
    }

    if (!verificarPassword(actual, hash)) {
      throw HttpError.badRequest('La contrasena actual es incorrecta.');
    }

    const nuevaValida = this.exigirContrasena(nueva);

    if (verificarPassword(nuevaValida, hash)) {
      throw HttpError.badRequest('La contrasena nueva debe ser distinta a la actual.');
    }

    await this.repositorio.actualizarPasswordHash(id, hashPassword(nuevaValida));
  }

  async actualizar(id: string, input: EntradaUsuarioSinValidar): Promise<Usuario> {
    const actual = await this.repositorio.obtenerPorId(id);

    if (!actual) {
      throw HttpError.notFound(`No existe un usuario con id ${id}.`);
    }

    const nombre = this.exigirNombre(input.nombre);
    const correo = this.exigirCorreo(input.correo);

    // El correo es la identidad: no puede repetir, salvo sobre el propio
    // usuario que se esta editando.
    await this.asegurarCorreoLibre(correo, id);

    const actualizado = await this.repositorio.actualizar(id, {
      nombre,
      correo,
      rol: this.exigirRol(input.rol),
      estado: this.exigirEstado(input.estado),
    });

    if (!actualizado) {
      throw HttpError.notFound(`No existe un usuario con id ${id}.`);
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

  private exigirCorreo(value: string | undefined): string {
    const correo = value?.trim().toLowerCase() ?? '';

    if (!PATRON_CORREO.test(correo)) {
      throw HttpError.badRequest('El correo no tiene un formato valido.');
    }

    return correo;
  }

  private exigirContrasena(value: string | undefined): string {
    const contrasena = value ?? '';

    if (contrasena.length < LONGITUD_MINIMA_CONTRASENA) {
      throw HttpError.badRequest(
        `La contrasena debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres.`,
      );
    }

    return contrasena;
  }

  private exigirRol(value: RolUsuario | undefined): RolUsuario {
    if (!value || !ROLES_USUARIO.includes(value)) {
      throw HttpError.badRequest('El rol no es valido.');
    }

    return value;
  }

  private exigirEstado(value: EstadoUsuario | undefined): EstadoUsuario {
    if (value !== 'Activo' && value !== 'Inactivo') {
      throw HttpError.badRequest('El estado no es valido.');
    }

    return value;
  }

  /** Lanza 409 si el correo ya pertenece a otro usuario. */
  private async asegurarCorreoLibre(correo: string, exceptoId?: string): Promise<void> {
    const usuarios = await this.repositorio.listar();
    const ocupado = usuarios.some(
      (usuario) => usuario.correo === correo && usuario.id !== exceptoId,
    );

    if (ocupado) {
      throw new HttpError(409, 'Ya existe un usuario con ese correo.');
    }
  }
}

export const usuarioServicio = new UsuarioServicio(usuarioRepositorio);