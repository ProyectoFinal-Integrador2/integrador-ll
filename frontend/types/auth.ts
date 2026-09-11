export type UserRole = 'usuario' | 'jefe_ti' | 'tecnico';

export interface UserProfile {
  id: string;
  rol: UserRole;
  nombre_completo: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: any | null;
  session: any | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; role?: UserRole; error?: string; status?: number }>;
  logout: () => Promise<void>;
  getUser: () => any | null;
  getRole: () => UserRole | null;
  refreshProfile: () => Promise<UserProfile | null>;
}
