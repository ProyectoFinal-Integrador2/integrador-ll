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

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;

export type Env = typeof env;
