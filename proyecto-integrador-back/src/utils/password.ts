import bcrypt from 'bcryptjs';

const COSTE = 10;

export const hashPassword = (plain: string): string => bcrypt.hashSync(plain, COSTE);

export const verificarPassword = (plain: string, hash: string): boolean =>
  bcrypt.compareSync(plain, hash);
