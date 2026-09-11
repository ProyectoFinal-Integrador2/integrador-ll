import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

export type UserRole = 'usuario' | 'jefe_ti' | 'tecnico';

export interface UserProfile {
  id: string;
  rol: UserRole;
  nombre_completo: string;
  created_at: string;
  updated_at: string;
}

/**
 * Servicio de Autenticación Backend
 * Aplica el Patrón Singleton para mantener una única conexión con Supabase.
 */
export class AuthService {
  private static instance: AuthService;
  private supabase: SupabaseClient;
  private readonly schemaName = 'bd_sistema_incidencia';

  private constructor() {
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      'https://hfcfwoxdbzrpzfffflsl.supabase.co';

    const supabaseServiceKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      'sb_secret_1cTx-b7vdfPl4G6tIvJ-Yw_pGXcRv6X';

    // En el backend utilizamos la Service Role Key para operaciones privilegiadas
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: this.schemaName },
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Inicia sesión validando credenciales
   */
  public async signIn(email: string, password: string): Promise<{
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    error: { message: string; status?: number } | null;
  }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return {
          user: null,
          session: null,
          profile: null,
          error: {
            message: error?.message || 'Credenciales inválidas',
            status: error?.status || 401,
          },
        };
      }

      const profile = await this.getUserProfile(data.user.id);

      return {
        user: data.user,
        session: data.session,
        profile,
        error: null,
      };
    } catch (err: any) {
      return {
        user: null,
        session: null,
        profile: null,
        error: { message: err.message || 'Error interno del servidor', status: 500 },
      };
    }
  }

  /**
   * Obtiene el perfil desde bd_sistema_incidencia.perfiles
   */
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .schema(this.schemaName)
        .from('perfiles')
        .select('id, rol, nombre_completo, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }
      return data as UserProfile;
    } catch {
      return null;
    }
  }

  /**
   * Valida un token JWT en el backend
   */
  public async validateToken(jwtToken: string): Promise<{ user: User | null; profile: UserProfile | null; isValid: boolean }> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(jwtToken);
      if (error || !user) return { user: null, profile: null, isValid: false };

      const profile = await this.getUserProfile(user.id);
      return { user, profile, isValid: true };
    } catch {
      return { user: null, profile: null, isValid: false };
    }
  }
}

export const authService = AuthService.getInstance();
