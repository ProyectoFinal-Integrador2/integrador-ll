/**
 * Error con codigo HTTP. Permite que los services lancen el fallo de dominio
 * y que el errorHandler lo traduzca, sin que el service conozca `res`.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }

  static badRequest(message: string): HttpError {
    return new HttpError(400, message);
  }

  static notFound(message: string): HttpError {
    return new HttpError(404, message);
  }
}
