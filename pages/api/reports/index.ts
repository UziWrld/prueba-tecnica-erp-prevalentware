import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtiene el reporte financiero con saldo y movimientos
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Reporte con saldo actual y lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: Saldo actual (ingresos - egresos)
 *                 movements:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado - se requiere rol ADMIN
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await requireAuth(req, res, 'ADMIN');
  if (!session) return;

  if (req.method === 'GET') {
    const movements = await prisma.movement.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { date: 'asc' },
    });

    // Calcular el saldo actual: suma de ingresos - suma de egresos
    const balance = movements.reduce((acc, m) => {
      return m.type === 'INCOME' ? acc + m.amount : acc - m.amount;
    }, 0);

    return res.status(200).json({ balance, movements });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: `Método ${req.method} no permitido.` });
}
