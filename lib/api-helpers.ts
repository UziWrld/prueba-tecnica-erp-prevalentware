import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

export type Role = 'ADMIN' | 'USER';

/**
 * Verifica que la solicitud tenga una sesión activa y,
 * opcionalmente, que el usuario tenga el rol requerido.
 *
 * Retorna la sesión si es válida, o responde con 401/403 y null.
 */
export async function requireAuth(
    req: NextApiRequest,
    res: NextApiResponse,
    role?: Role,
) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        res.status(401).json({ error: 'No autenticado. Inicia sesión para continuar.' });
        return null;
    }

    if (role && (session.user as { role?: string }).role !== role) {
        res.status(403).json({ error: 'Acceso denegado. No tienes permisos suficientes.' });
        return null;
    }

    return session;
}
