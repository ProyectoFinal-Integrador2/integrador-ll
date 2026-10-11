import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const parsePort = (value: string | undefined): number => {
  if (!value) return 3000;

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT invalido: "${value}". Debe ser un entero entre 1 y 65535.`);
  }

  return port;
};

const parseDatabaseUrl = (value: string | undefined): string => {
  if (!value || value.trim().length === 0) {
    throw new Error(
      'DATABASE_URL falta en el .env. Se obtiene de Project Settings -> Database -> Connection string.',
    );
  }

  if (!value.startsWith('postgres')) {
    throw new Error('DATABASE_URL debe ser una conexion de Postgres (postgres:// o postgresql://).');
  }

  return value;
};

const parseJwtSecret = (value: string | undefined): string => {
  if (!value || value.trim().length < 16) {
    throw new Error(
      'JWT_SECRET falta en el .env. Debe tener al menos 16 caracteres (se firma el token de sesion).',
    );
  }

  return value.trim();
};

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: parseDatabaseUrl(process.env.DATABASE_URL),
  jwtSecret: parseJwtSecret(process.env.JWT_SECRET),
} as const;

export type Env = typeof env;