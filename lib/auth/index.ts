import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  // URL base fija para producción para que coincida con GitHub OAuth
  baseURL: 'https://prueba-tecnica-erp-prevalentware-ke.vercel.app',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  advanced: {
    // Esto asegura que las cookies sean seguras en Vercel
    useSecureCookies: true,
  },
  trustedOrigins: [
    'https://prueba-tecnica-erp-prevalentware-ke.vercel.app',
    'https://prueba-tecnica-erp-prevalentware-kevin-torres-io9ek364d.vercel.app',
    'https://prueba-tecnica-erp-prevalentware-ke-git-main-uziwrlds-projects.vercel.app'
  ],
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
