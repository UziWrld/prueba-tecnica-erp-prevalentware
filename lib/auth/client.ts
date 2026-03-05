import { createAuthClient } from 'better-auth/react';

// Cliente de autenticación para uso en el lado del cliente (React)
export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
