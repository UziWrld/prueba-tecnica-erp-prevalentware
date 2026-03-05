import { createAuthClient } from 'better-auth/react';

// Cliente de autenticación para uso en el lado del cliente (React)
// No definimos baseURL aquí para que use el dominio actual del navegador (evita 403)
export const authClient = createAuthClient();
