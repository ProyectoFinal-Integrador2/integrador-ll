import { apiGet } from './apiClient';
import type { ArticuloConocimiento } from '../types/knowledge.types';

export const obtenerArticulos = (
  signal?: AbortSignal,
): Promise<ArticuloConocimiento[]> =>
  apiGet<ArticuloConocimiento[]>('/knowledge-base', signal);