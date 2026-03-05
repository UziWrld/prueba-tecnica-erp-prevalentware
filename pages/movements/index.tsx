import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ReceiptText, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import Head from 'next/head';

type Movement = {
    id: string;
    concept: string;
    amount: number;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    user: { name: string; email: string };
};

export default function Movements({ user }: { user: any }) {
    // Estado para almacenar la lista de movimientos desde la API
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);
    // Controla la visibilidad del formulario para añadir un nuevo movimiento
    const [showForm, setShowForm] = useState(false);

    // Estados independientes para el formulario de creación de movimiento
    const [concept, setConcept] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
    const [submitting, setSubmitting] = useState(false);

    // Obtiene los movimientos desde la base de datos a través de la API REST
    const fetchMovements = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/movements');
            if (res.ok) {
                const data = await res.json();
                setMovements(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    // Maneja el envío del nuevo movimiento hacia el backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ concept, amount: Number(amount), date, type }),
            });
            if (res.ok) {
                // Al guardar exitosamente, cerramos y limpiamos el formulario
                setShowForm(false);
                setConcept('');
                setAmount('');
                setDate('');
                setType('INCOME');
                fetchMovements();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Head>
                <title>Movimientos - PrevalentWare</title>
            </Head>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <ReceiptText className="w-6 h-6 text-blue-600" />
                        Movimientos Financieros
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Visualiza y administra los ingresos y egresos del sistema.
                    </p>
                </div>
                {user?.role === 'ADMIN' && (
                    <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Movimiento
                    </Button>
                )}
            </div>

            {showForm && (
                <Card className="border-blue-100 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                        <CardTitle className="text-lg text-blue-900">Nuevo Movimiento</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Concepto</label>
                                <input
                                    required value={concept} onChange={e => setConcept(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Pago de nómina"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Monto ($)</label>
                                <input
                                    required type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Fecha</label>
                                <input
                                    required type="date" value={date} onChange={e => setDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Tipo</label>
                                <select
                                    value={type} onChange={e => setType(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="INCOME">Ingreso</option>
                                    <option value="EXPENSE">Egreso</option>
                                </select>
                            </div>
                            <div className="lg:col-span-5 flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                                    Cancelar
                                </button>
                                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 shadow-md">
                                    {submitting ? 'Guardando...' : 'Guardar Nuevo'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50/80 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Concepto</th>
                                <th className="px-6 py-4 font-semibold">Tipo</th>
                                <th className="px-6 py-4 font-semibold text-right">Monto</th>
                                <th className="px-6 py-4 font-semibold">Fecha</th>
                                <th className="px-6 py-4 font-semibold">Registrado por</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                                        Cargando movimientos...
                                    </td>
                                </tr>
                            ) : movements.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No hay movimientos registrados.
                                    </td>
                                </tr>
                            ) : (
                                movements.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {mov.concept}
                                        </td>
                                        <td className="px-6 py-4">
                                            {mov.type === 'INCOME' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    <TrendingUp className="w-3 h-3 mr-1" /> Ingreso
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
                                                    <TrendingDown className="w-3 h-3 mr-1" /> Egreso
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold ${mov.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {mov.type === 'INCOME' ? '+' : '-'}$ {mov.amount.toLocaleString('es-CO')}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(mov.date).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-medium">{mov.user.name}</span>
                                                <span className="text-slate-500 text-xs">{mov.user.email}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
