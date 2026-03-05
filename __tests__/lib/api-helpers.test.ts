import { describe, it, expect, vi } from 'vitest';
import { requireAuth } from '../../lib/api-helpers';

// Mock de better-auth
vi.mock('better-auth/node', () => ({
  fromNodeHeaders: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';

describe('requireAuth helper', () => {
  it('returns 401 when there is no session', async () => {
    // Mock getSession to return null (no session)
    (auth.api.getSession as any).mockResolvedValueOnce(null);

    const req = { headers: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    const result = await requireAuth(req, res);

    expect(result).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No autenticado. Inicia sesión para continuar.',
    });
  });

  it('returns 403 when user does not have required role', async () => {
    // Mock getSession with a USER role
    (auth.api.getSession as any).mockResolvedValueOnce({
      user: { id: '1', role: 'USER' },
    });

    const req = { headers: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    // Require ADMIN
    const result = await requireAuth(req, res, 'ADMIN');

    expect(result).toBeNull();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Acceso denegado. No tienes permisos suficientes.',
    });
  });
});
