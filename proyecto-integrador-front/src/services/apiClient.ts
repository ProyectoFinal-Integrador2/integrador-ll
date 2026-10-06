
const API_BASE = '/api/v1';

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

export const apiGet = async <T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, { signal });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as T;
};

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