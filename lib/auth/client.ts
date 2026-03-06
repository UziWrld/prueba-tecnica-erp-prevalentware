import { createAuthClient } from 'better-auth/react';

// Cliente de autenticación para uso en el lado del cliente (React)
// Sin baseURL detecta el origen automáticamente, eliminando bloqueos de CORS
export const authClient = createAuthClient();
