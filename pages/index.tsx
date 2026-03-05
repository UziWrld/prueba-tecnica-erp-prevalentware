import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReceiptText, Users, LayoutDashboard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home({ user }: { user: any }) {
    // Obtenemos el rol del usuario actualmente autenticado (ADMIN o USER)
    const role = user?.role;

    // Configuración de las tarjetas (cards) que aparecerán en el inicio
    const cards = [
        {
            title: 'Movimientos Financieros',
            description: 'Gestión central de ingresos y egresos.',
            icon: ReceiptText,
            href: '/movements',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            roles: ['ADMIN', 'USER'],
        },
        {
            title: 'Control de Usuarios',
            description: 'Administración de accesos y roles.',
            icon: Users,
            href: '/users',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            roles: ['ADMIN'],
        },
        {
            title: 'Reportes y Analítica',
            description: 'Gráficos financieros y descarga CSV.',
            icon: LayoutDashboard,
            href: '/reports',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            roles: ['ADMIN'],
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bienvenido de vuelta, {user?.name?.split(' ')[0] || 'Usuario'}</h2>
                <p className="text-slate-500 mt-1">
                    A continuación, selecciona el módulo al que deseas acceder:
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, i) => {
                    // Si el usuario no tiene los permisos necesarios (roles), no mostramos la tarjeta
                    if (!card.roles.includes(role)) return null;
                    return (
                        <Card key={i} className="hover:shadow-lg transition-all hover:-translate-y-1 duration-200 border-none shadow-md overflow-hidden bg-white group">
                            <CardHeader className="pb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} mb-4 group-hover:scale-110 transition-transform`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <CardTitle className="text-xl text-slate-800">{card.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Link href={card.href} className="w-full">
                                    <Button variant="outline" className="w-full justify-between items-center group-hover:bg-slate-50 transition-colors">
                                        Acceder a la herramienta
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
