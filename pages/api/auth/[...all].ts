import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

// Deshabilitar el body parsing de Next.js para que Better Auth lo gestione manualmente
export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);
