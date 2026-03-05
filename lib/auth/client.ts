import { createAuthClient } from 'better-auth/react';

// Cliente de autenticación para uso en el lado del cliente (React)
export const authClient = createAuthClient({
    baseURL: 'https://prueba-tecnica-erp-prevalentware-ke.vercel.app',
});
