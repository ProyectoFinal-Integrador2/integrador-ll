import { apiGet, apiSend } from './apiClient';
import type { CreateUserInput, UpdateUserInput, User } from '../types/user.types';

export const fetchUsers = (signal?: AbortSignal): Promise<User[]> =>
  apiGet<User[]>('/users', signal);

/** El back responde el usuario ya creado, asi que no hay que recargar la lista. */
export const createUser = (input: CreateUserInput): Promise<User> =>
  apiSend<User>('/users', 'POST', input);

export const updateUser = (
  id: string,
  input: UpdateUserInput,
): Promise<User> => apiSend<User>(`/users/${id}`, 'PUT', input);