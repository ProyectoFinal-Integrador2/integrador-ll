/**
 * Rutas relativas a proposito: el proxy de Vite (/api -> localhost:3000) las
 * resuelve. Pegar http://localhost:3000 aqui saltaria el proxy y traeria CORS.
 */
const API_BASE = '/api/v1';

/** El back responde { error: string } en 4xx y 5xx. */
const readError = async (response: Response): Promise<string> => {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
    ) {
      return body.error;
    }
  } catch {
    // Respuesta sin JSON: cae al mensaje generico.
  }
  return `Error ${response.status}`;
};

/**
 * GET con parseo directo a T. El `as` es una confianza en el back: si el
 * contrato de `types/` y el del servidor divergen, el error aparece al
 * leer un campo, no aca.
 */
export const apiGet = async <T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, { signal });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as T;
};

/** POST, PUT y PATCH: mandan body y devuelven el recurso ya creado o actualizado. */
export const apiSend = async <T>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body: unknown,
): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as T;
};