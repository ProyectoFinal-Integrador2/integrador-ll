import { borrarToken, leerToken } from './sessionStore';

const API_BASE = '/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly intentosRestantes?: number;
  readonly bloqueadoHasta?: string;
  readonly segundosRestantes?: number;
  constructor(message: string, status: number, intentosRestantes?: number,
    bloqueadoHasta?: string, segundosRestantes?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.intentosRestantes = intentosRestantes;
    this.bloqueadoHasta = bloqueadoHasta;
    this.segundosRestantes = segundosRestantes;
  }
}

const readError = async (response: Response): Promise<ApiError> => {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
    ) {
      return new ApiError(body.error, response.status,
        'intentosRestantes' in body && typeof body.intentosRestantes === 'number' ? body.intentosRestantes : undefined,
        'bloqueadoHasta' in body && typeof body.bloqueadoHasta === 'string' ? body.bloqueadoHasta : undefined,
        'segundosRestantes' in body && typeof body.segundosRestantes === 'number' ? body.segundosRestantes : undefined);
    }
  } catch {
    // Respuesta sin JSON: cae al mensaje generico.
  }
  return new ApiError(`Error ${response.status}`, response.status);
};

const manejarSesionInvalida = (path: string, status: number): void => {
  if (status !== 401 || path.startsWith('/auth/login')) return;

  borrarToken();

  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

const cabecerasDeSesion = (extra: Record<string, string>): Record<string, string> => {
  const token = leerToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
};

const ejecutar = async <T>(path: string, init: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, init);

  if (!response.ok) {
    manejarSesionInvalida(path, response.status);
    throw await readError(response);
  }

  return (await response.json()) as T;
};

export const apiGet = async <T>(path: string, signal?: AbortSignal): Promise<T> =>
  ejecutar<T>(path, {
    method: 'GET',
    headers: cabecerasDeSesion({}),
    signal,
  });

export const apiSend = async <T>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body: unknown,
): Promise<T> =>
  ejecutar<T>(path, {
    method,
    headers: cabecerasDeSesion({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
