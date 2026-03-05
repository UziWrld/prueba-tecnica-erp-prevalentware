import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtiene la lista de movimientos financieros
 *     tags: [Movimientos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimientos con datos del usuario
 *       401:
 *         description: No autenticado
 *   post:
 *     summary: Crea un nuevo movimiento financiero
 *     tags: [Movimientos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [concept, amount, date, type]
 *             properties:
 *               concept:
 *                 type: string
 *                 example: "Pago de nómina"
 *               amount:
 *                 type: number
 *                 example: 1500000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-01"
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *     responses:
 *       201:
 *         description: Movimiento creado exitosamente
 *       400:
 *         description: Faltan campos requeridos
 *       401:
 *         description: No autenticado
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verificamos que exista una sesión activa antes de procesar cualquier solicitud.
    // Si no la hay, el helper requireAuth responde directamente con un 401.
    const session = await requireAuth(req, res);
    if (!session) return;

    if (req.method === 'GET') {
        // Obtenemos todos los movimientos de la base de datos, incluyendo la 
        // información básica del usuario que los creó (relación en Prisma).
        const movements = await prisma.movement.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { date: 'desc' }, // Los más recientes primero
        });
        return res.status(200).json(movements);
    }

    if (req.method === 'POST') {
        const { concept, amount, date, type } = req.body;

        // Validación básica de datos obligatorios recibidos en el body
        if (!concept || !amount || !date || !type) {
            return res.status(400).json({ error: 'Los campos concept, amount, date y type son requeridos.' });
        }

        // Creamos el registro en la base de datos asignando el ID del usuario
        // de la sesión actual al campo 'userId'.
        const movement = await prisma.movement.create({
            data: {
                concept,
                amount: parseFloat(amount),
                date: new Date(date),
                type,
                userId: session.user.id,
            },
        });
        return res.status(201).json(movement);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido.` });
}
