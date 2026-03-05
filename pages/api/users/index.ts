import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene la lista de usuarios registrados
 *     tags: [Usuarios]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado - se requiere rol ADMIN
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await requireAuth(req, res, 'ADMIN');
    if (!session) return;

    if (req.method === 'GET') {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(users);
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido.` });
}
