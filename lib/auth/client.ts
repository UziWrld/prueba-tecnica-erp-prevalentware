import { createAuthClient } from 'better-auth/react';

// Cliente de autenticación para uso en el lado del cliente (React)
// Al no pasar baseURL, detecta automáticamente el dominio actual, evitando errores de CORS
export const authClient = createAuthClient();
