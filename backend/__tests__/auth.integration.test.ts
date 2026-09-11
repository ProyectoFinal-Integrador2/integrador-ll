import request from 'supertest';
import { app } from '../src/server';
import { authService } from '../src/services/authService';

jest.mock('../src/services/authService', () => ({
  authService: {
    signIn: jest.fn(),
    validateToken: jest.fn(),
    getUserProfile: jest.fn(),
  },
}));

describe('Pruebas de Integración Backend - API /api/auth (Supertest)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('1. Debe retornar 200 OK con token y perfil en login exitoso', async () => {
      (authService.signIn as jest.Mock).mockResolvedValueOnce({
        user: { id: 'usr-back-1', email: 'jefe.ti@empresa.com' },
        session: { access_token: 'jwt-valid-back-123' },
        profile: {
          id: 'usr-back-1',
          rol: 'jefe_ti',
          nombre_completo: 'Carlos Jefe TI',
        },
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jefe.ti@empresa.com',
          password: 'PasswordSeguro123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('jwt-valid-back-123');
      expect(response.body.profile.rol).toBe('jefe_ti');
    });

    it('2. Debe retornar 401 Unauthorized cuando las credenciales son inválidas', async () => {
      (authService.signIn as jest.Mock).mockResolvedValueOnce({
        user: null,
        session: null,
        profile: null,
        error: { message: 'Invalid login credentials', status: 401 },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalido@empresa.com',
          password: 'clave_incorrecta',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid login credentials');
    });

    it('3. Debe retornar 400 Bad Request si faltan parámetros obligatorios', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'solo_correo@empresa.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email y contraseña son campos obligatorios.');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('4. Debe retornar 200 OK al verificar un token JWT válido', async () => {
      (authService.validateToken as jest.Mock).mockResolvedValueOnce({
        isValid: true,
        user: { id: 'tec-777', email: 'tecnico@empresa.com' },
        profile: {
          id: 'tec-777',
          rol: 'tecnico',
          nombre_completo: 'Juan Técnico',
        },
      });

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer token_valido_xyz');

      expect(response.status).toBe(200);
      expect(response.body.profile.rol).toBe('tecnico');
    });

    it('5. Debe retornar 401 si no se envía la cabecera Authorization', async () => {
      const response = await request(app).get('/api/auth/verify');
      expect(response.status).toBe(401);
    });
  });
});
