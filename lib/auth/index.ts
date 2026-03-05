import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  // Detectar la URL base dinámicamente para evitar errores 403 de CORS/CSRF en Vercel Previews
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL),
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'ADMIN',
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  // Asigna el rol ADMIN a todos los usuarios nuevos automáticamente
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
