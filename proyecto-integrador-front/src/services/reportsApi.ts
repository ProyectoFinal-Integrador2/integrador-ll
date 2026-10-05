import { apiGet } from './apiClient';
import type { ServiceReport } from '../types/report.types';

export const fetchServiceReport = (signal?: AbortSignal): Promise<ServiceReport> =>
  apiGet<ServiceReport>('/reports/summary', signal);