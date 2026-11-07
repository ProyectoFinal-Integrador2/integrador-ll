import assert from 'node:assert/strict';
import { test } from 'vitest';
import { AuthService } from '../src/services/auth.service';
import type { UsuarioRepositorio } from '../src/repositories/user.repository';
import type { EstadoIntentos, IntentosRepositorio } from '../src/repositories/loginAttempts.repository';
import { hashPassword } from '../src/utils/password';
import { HttpError } from '../src/utils/httpError';

// Reloj y repositorios aislados: no modifica cuentas ni espera 15 minutos reales.
const preparar = () => {
  let tiempo = Date.parse('2026-11-05T12:00:00Z');
  const estados = new Map<string, EstadoIntentos>();
  const intentos: IntentosRepositorio = {
    async conBloqueo(correo, accion) {
      return accion(estados.get(correo) ?? { intentos: 0, bloqueadoHasta: null }, async (estado) => {
        estados.set(correo, estado);
      });
    },
  };
  const passwordHash = hashPassword('Correcta123!');
  const usuarios = {
    async obtenerCredencialPorCorreo(correo: string) {
      if (correo === 'inexistente@example.test') return undefined;
      return { passwordHash, usuario: { id: '1', correo, nombre: 'Prueba', estado: 'Activo', rol: 'Usuario' } };
    },
  } as unknown as UsuarioRepositorio;
  return { servicio: new AuthService(usuarios, intentos, () => tiempo), estados,
    avanzar: (ms: number) => { tiempo += ms; } };
};

async function fallo(servicio: AuthService, correo: string, status: number, restantes: number, clave = 'Incorrecta') {
  await assert.rejects(servicio.login(correo, clave, 'Usuario'), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.status, status);
    assert.equal(error.detalles?.intentosRestantes, restantes);
    return true;
  });
}

test('tercer fallo bloquea solo ese correo; clave correcta no evita bloqueo ni extiende plazo', async () => {
  const { servicio, estados, avanzar } = preparar();
  await fallo(servicio, ' A@example.test ', 401, 2);
  await fallo(servicio, 'a@example.test', 401, 1);
  await fallo(servicio, 'a@example.test', 429, 0);
  const hasta = estados.get('a@example.test')?.bloqueadoHasta;
  avanzar(60_000);
  await fallo(servicio, 'a@example.test', 429, 0, 'Correcta123!');
  assert.equal(estados.get('a@example.test')?.bloqueadoHasta, hasta);
  await fallo(servicio, 'b@example.test', 401, 2);
  assert.ok((await servicio.login('c@example.test', 'Correcta123!', 'Usuario')).token);
});

test('al cumplir exactamente 15 minutos, el siguiente fallo cuenta como primero', async () => {
  const { servicio, avanzar } = preparar();
  await fallo(servicio, 'a@example.test', 401, 2);
  await fallo(servicio, 'a@example.test', 401, 1);
  await fallo(servicio, 'a@example.test', 429, 0);
  avanzar(15 * 60_000 - 1);
  await fallo(servicio, 'a@example.test', 429, 0);
  avanzar(1);
  await fallo(servicio, 'a@example.test', 401, 2);
});

test('login exitoso reinicia fallos y permite entrar después de vencer el bloqueo', async () => {
  const { servicio, avanzar } = preparar();
  await fallo(servicio, 'a@example.test', 401, 2);
  await servicio.login('a@example.test', 'Correcta123!', 'Usuario');
  await fallo(servicio, 'a@example.test', 401, 2);
  await fallo(servicio, 'a@example.test', 401, 1);
  await fallo(servicio, 'a@example.test', 429, 0);
  avanzar(15 * 60_000);
  assert.ok((await servicio.login('a@example.test', 'Correcta123!', 'Usuario')).token);
  await fallo(servicio, 'a@example.test', 401, 2);
});

test('correo inexistente sigue el mismo contador y no revela si la cuenta existe', async () => {
  const { servicio } = preparar();
  await fallo(servicio, 'inexistente@example.test', 401, 2);
  await fallo(servicio, 'inexistente@example.test', 401, 1);
  await fallo(servicio, 'inexistente@example.test', 429, 0);
});
