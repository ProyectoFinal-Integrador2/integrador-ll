import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';

const COSTE = 10;

const MINUSCULAS = 'abcdefghijkmnopqrstuvwxyz';
const MAYUSCULAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const NUMEROS = '23456789';
const SIMBOLOS = '!@#$%&*?-_=+';

const CARACTERES = MINUSCULAS + MAYUSCULAS + NUMEROS + SIMBOLOS;
const LONGITUD = 12;

/** Garantiza al menos un caracter de cada grupo y el resto se sortea. */
const construir = (partes: string[]): string => {
  let resultado = partes.join('');
  while (resultado.length < LONGITUD) {
    resultado += CARACTERES[randomInt(CARACTERES.length)];
  }
  return resultado;
};

/** Mezcla los caracteres para que no queden en orden de grupo. */
const barajar = (valor: string): string => {
  const caracteres = [...valor];
  for (let i = caracteres.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [caracteres[i], caracteres[j]] = [caracteres[j], caracteres[i]];
  }
  return caracteres.join('');
};

/** Password temporal de 12 caracteres: mayuscula, minuscula, numero y simbolo. */
export const generarContrasenaAleatoria = (): string => {
  const muestra = [
    MINUSCULAS[randomInt(MINUSCULAS.length)],
    MAYUSCULAS[randomInt(MAYUSCULAS.length)],
    NUMEROS[randomInt(NUMEROS.length)],
    SIMBOLOS[randomInt(SIMBOLOS.length)],
  ];
  return barajar(construir(muestra));
};

export const hashPassword = (plain: string): string => bcrypt.hashSync(plain, COSTE);

export const verificarPassword = (plain: string, hash: string): boolean =>
  bcrypt.compareSync(plain, hash);
