import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Code2, Github, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            <Head>
                <title>Login - PrevalentWare</title>
            </Head>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md shadow-2xl shadow-blue-900/5 border-slate-200/60 z-10 bg-white/80 backdrop-blur-xl">
                <CardHeader className="space-y-4 items-center pt-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 transform transition-transform hover:scale-105">
                        <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                            Prevalent<span className="text-blue-600">Ware</span>
                        </CardTitle>
                        <CardDescription className="text-base text-slate-500">
                            Sistema de Gestión ERP Financiera
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 pb-8">
                    <Button
                        className="w-full h-12 text-base font-medium transition-all shadow-md hover:shadow-lg bg-slate-900 hover:bg-slate-800 text-white"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        ) : (
                            <Github className="w-5 h-5 mr-3" />
                        )}
                        Continuar con GitHub
                        {!isLoading && <ArrowRight className="w-4 h-4 ml-auto opacity-70" />}
                    </Button>
                </CardContent>
                <CardFooter className="justify-center border-t border-slate-100 bg-slate-50/50 py-4">
                    <p className="text-sm text-slate-500 text-center">
                        Uso exclusivo para personal autorizado.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
