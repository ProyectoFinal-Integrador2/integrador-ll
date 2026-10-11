import { apiGet, apiSend } from './apiClient';
import type {
  ArticuloConocimiento,
  EntradaArticuloConocimiento,
} from '../types/knowledge.types';

export const obtenerArticulos = (
  signal?: AbortSignal,
): Promise<ArticuloConocimiento[]> =>
  apiGet<ArticuloConocimiento[]>('/knowledge-base', signal);

export const crearArticulo = (
  input: EntradaArticuloConocimiento,
): Promise<ArticuloConocimiento> =>
  apiSend<ArticuloConocimiento>('/knowledge-base', 'POST', input);