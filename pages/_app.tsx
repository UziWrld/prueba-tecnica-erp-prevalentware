import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/layout/Layout';

// Páginas que no requieren Layout ni protección (públicas)
const publicPages = ['/login', '/api/docs'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const isPublicPage =
    publicPages.includes(router.pathname) ||
    router.pathname.startsWith('/api/docs');

  useEffect(() => {
    if (!isPending) {
      if (!session && !isPublicPage) {
        // Redirigir a login si no hay sesión y no es página pública
        router.push('/login');
      } else if (session && router.pathname === '/login') {
        // Redirigir al inicio si hay sesión y trata de entrar al login
        router.push('/');
      }
    }
  }, [session, isPending, router.pathname, router, isPublicPage]);

  if (isPending) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin' />
      </div>
    );
  }

  // Si estamos en una página protegida y no hay sesión (mientras redirige)
  if (!session && !isPublicPage) {
    return null;
  }

  // Si es página pública (como login), renderiza directo sin Layout
  if (isPublicPage) {
    return <Component {...pageProps} />;
  }

  const role = session?.user?.role as string | undefined;

  return (
    <Layout role={role}>
      <Component {...pageProps} user={session?.user} />
    </Layout>
  );
}
