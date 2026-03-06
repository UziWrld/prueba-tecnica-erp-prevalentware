import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  BarChart3,
  UserCog,
  ArrowDownUp,
  LogOut,
} from 'lucide-react';
import { authClient } from '@/lib/auth/client';

export default function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) {
  const role = user?.role;
  const router = useRouter();

  // Función para manejar el cierre de sesión usando Better Auth
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Redirigir al usuario a la página de login al salir exitosamente
          router.push('/login');
        },
      },
    });
  };

  // Definición de las opciones del menú de navegación.
  // 'roles' indica qué tipo de usuario tiene permiso para ver cada ruta.
  const navItems = [
    {
      label: 'Movimientos',
      href: '/movements',
      icon: ArrowDownUp,
      roles: ['ADMIN', 'USER'],
    },
    { label: 'Usuarios', href: '/users', icon: UserCog, roles: ['ADMIN'] },
    {
      label: 'Reportes',
      href: '/reports',
      icon: BarChart3,
      roles: ['ADMIN'],
    },
  ];

  return (
    <div className='flex h-screen bg-slate-50 text-slate-900'>
      <Head>
        <title>PrevalentWare - Tech Solutions</title>
      </Head>

      {/* Sidebar */}
      <aside className='w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800'>
        {/* Logo de la empresa directamente sobre el fondo oscuro del sidebar */}
        <div className='h-16 flex items-center px-5 border-b border-slate-800 bg-slate-950'>
          <Image
            src='/logo-prevalentware.png'
            alt='PrevalentWare'
            width={130}
            height={32}
            className='object-contain h-7 w-auto'
          />
        </div>

        <nav className='flex-1 py-6 px-3 space-y-1'>
          <p className='px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>
            Gestión ERP
          </p>
          {navItems.map((item) => {
            // Si se pasó un rol y el menú actual no permite ese rol, lo ocultamos
            if (role && !item.roles.includes(role)) return null;

            // Determinar si la ruta actual coincide con el elemento del menú para resaltarlo
            const isActive = router.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}
                />
                <span className='font-medium text-sm'>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-slate-800'>
          <button
            onClick={handleLogout}
            className='flex items-center w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors group'
          >
            <LogOut className='w-5 h-5 mr-3 text-slate-500 group-hover:text-red-400' />
            <span className='font-medium text-sm'>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Topbar */}
        <header className='h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10'>
          <h1 className='text-xl font-semibold text-slate-800'>
            {(() => {
              const path = router.pathname.split('/')[1];
              const titles: Record<string, string> = {
                '': 'Panel de Control',
                'users': 'Gestión de Usuarios',
                'movements': 'Movimientos Financieros',
                'reports': 'Reportes y Analítica',
              };
              return titles[path] || titles[''];
            })()}
          </h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='text-right hidden md:block'>
                <p className='text-sm font-semibold text-slate-700 leading-tight'>
                  {user?.name || 'Usuario'}
                </p>
                <p className='text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5'>
                  {role === 'ADMIN' ? 'Administrador' : 'Colaborador'}
                </p>
              </div>
              <div className='w-10 h-10 rounded-full border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-inner'>
                {user?.image ? (
                  <img src={user.image} alt={user.name} className='w-full h-full object-cover' />
                ) : (
                  <span className='text-sm'>{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-auto bg-slate-50/50 p-8'>
          <div className='max-w-6xl mx-auto'>{children}</div>
        </div>
      </main>
    </div>
  );
}
