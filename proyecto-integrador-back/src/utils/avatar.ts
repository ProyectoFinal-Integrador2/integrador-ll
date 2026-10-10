import type { ColorAvatar, RolUsuario } from '../types/user.types';

export const COLOR_AVATAR_POR_ROL: Record<RolUsuario, ColorAvatar> = {
  'Jefe TI': 'blue',
  'Técnico': 'green',
  'Usuario': 'amber',
};

export const inicialesDeNombre = (nombre: string): string => {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) return '';
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
};