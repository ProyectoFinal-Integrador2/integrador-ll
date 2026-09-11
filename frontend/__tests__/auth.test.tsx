import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

const LoginForm: React.FC = () => {
  return <div data-testid="unimplemented-login-form">Componente aún no implementado</div>;
};

describe('Frontend - Módulo de Autenticación TDD (HU-001)', () => {
  let mockPush: jest.Mock;
  let mockSignInWithPassword: jest.Mock;
  let mockSignOut: jest.Mock;
  let mockFrom: jest.Mock;
  let mockSchema: jest.Mock;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    mockSignInWithPassword = jest.fn();
    mockSignOut = jest.fn();
    mockFrom = jest.fn();
    mockSchema = jest.fn().mockReturnValue({ from: mockFrom });

    mockSupabase = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
      },
      schema: mockSchema,
      from: mockFrom,
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('1. Debe iniciar sesión exitosamente con credenciales válidas', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'usr-1', email: 'tecnico@empresa.com' } },
      error: null,
    });

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'tecnico@empresa.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledTimes(1);
    });
  });
});
