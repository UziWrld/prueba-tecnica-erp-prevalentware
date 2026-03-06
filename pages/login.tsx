import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Github, ArrowRight, Lock } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: window.location.origin + '/',
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden'>
      <Head>
        <title>Iniciar Sesión - PrevalentWare ERP</title>
      </Head>

      {/* Efectos de luz decorativos en el fondo */}
      <div className='absolute top-[-30%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none' />

      {/* Grilla decorativa sutil en el fondo */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Contenido principal */}
      <div className='z-10 flex flex-col items-center gap-12 w-full max-w-sm px-4'>

        {/* Logo de PrevalentWare - blanco, directamente sobre el fondo oscuro */}
        <div className='flex flex-col items-center gap-4'>
          <Image
            src='/logo-prevalentware.png'
            alt='PrevalentWare'
            width={260}
            height={65}
            className='object-contain'
            priority
          />
          <span className='text-slate-500 text-xs tracking-[0.3em] uppercase font-semibold opacity-80'>
            ERP Financiero
          </span>
        </div>

        {/* Card de login con glassmorphism */}
        <div className='w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40'>
          <div className='mb-8 text-center'>
            <h2 className='text-3xl font-bold text-white tracking-tight'>
              Acceso Seguro
            </h2>
            <p className='text-slate-400 text-sm mt-3'>
              Autentícate con tu cuenta corporativa de GitHub
            </p>
          </div>

          <Button
            className='w-full h-12 text-sm font-semibold bg-white hover:bg-slate-100 text-slate-900 gap-3 transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5'
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='w-4 h-4 border-2 border-slate-400/40 border-t-slate-700 rounded-full animate-spin' />
            ) : (
              <Github className='w-5 h-5' />
            )}
            {isLoading ? 'Redirigiendo...' : 'Continuar con GitHub'}
            {!isLoading && <ArrowRight className='w-4 h-4 ml-auto text-slate-400' />}
          </Button>

          <div className='mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-slate-500 text-xs'>
            <Lock className='w-3 h-3' />
            <span>Uso exclusivo para personal autorizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

