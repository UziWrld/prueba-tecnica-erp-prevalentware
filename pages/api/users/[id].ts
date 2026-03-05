import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza el nombre y/o rol de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Faltan campos requeridos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado - se requiere rol ADMIN
 *       404:
 *         description: Usuario no encontrado
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await requireAuth(req, res, 'ADMIN');
    if (!session) return;

    const { id } = req.query;

    if (req.method === 'PUT') {
        const { name, role } = req.body;

        if (!name && !role) {
            return res.status(400).json({ error: 'Se requiere al menos el campo name o role.' });
        }

        const existingUser = await prisma.user.findUnique({ where: { id: id as string } });
        if (!existingUser) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: id as string },
            data: {
                ...(name && { name }),
                ...(role && { role }),
            },
        });
        return res.status(200).json(updatedUser);
    }

    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ error: `Método ${req.method} no permitido.` });
}
