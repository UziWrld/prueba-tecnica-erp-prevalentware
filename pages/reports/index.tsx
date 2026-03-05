import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Download,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Papa from 'papaparse';
import Head from 'next/head';

export default function Reports({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtiene los datos financieros consolidados desde la API REST (/api/reports)
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Genera y descarga un archivo CSV con todos los movimientos financieros utilizando PapaParse
  const handleDownloadCSV = () => {
    if (!data || !data.movements) return;

    // Aplanar y formatear los datos para las columnas del CSV
    const csvData = data.movements.map((mov: any) => ({
      ID: mov.id,
      Concepto: mov.concept,
      Monto: mov.amount,
      Fecha: new Date(mov.date).toISOString().split('T')[0],
      Tipo: mov.type === 'INCOME' ? 'Ingreso' : 'Egreso',
      Usuario_Nombre: mov.user.name,
      Usuario_Email: mov.user.email,
    }));

    // Convertir JSON a string en formato CSV
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `reporte_financiero_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200'>
        <ShieldAlert className='w-12 h-12 text-rose-500 mb-4' />
        <h2 className='text-xl font-bold text-slate-900 mb-2'>
          Acceso Denegado
        </h2>
        <p>Solo los administradores pueden ver los reportes financieros.</p>
      </div>
    );
  }

  // Agrupar movimientos por mes cronológico para graficar en Recharts
  const chartData =
    data?.movements.reduce((acc: any[], current: any) => {
      // Formatear la fecha (ej: 'ene. 2024')
      const month = new Date(current.date).toLocaleString('es-CO', {
        month: 'short',
        year: 'numeric',
      });
      const existing = acc.find((item) => item.name === month);

      if (existing) {
        // Si el mes ya existe en el acumulador, sumar al total de ingresos o egresos
        if (current.type === 'INCOME') existing.Ingresos += current.amount;
        else existing.Egresos += current.amount;
      } else {
        // Si no existe, crear una nueva entrada para ese mes
        acc.push({
          name: month,
          Ingresos: current.type === 'INCOME' ? current.amount : 0,
          Egresos: current.type === 'EXPENSE' ? current.amount : 0,
        });
      }
      return acc;
    }, []) || [];

  return (
    <div className='space-y-6'>
      <Head>
        <title>Reportes - PrevalentWare</title>
      </Head>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2'>
            <LayoutDashboard className='w-6 h-6 text-emerald-600' />
            Reporte Financiero
          </h2>
          <p className='text-sm text-slate-500 mt-1'>
            Resumen general del saldo y análisis de ingresos vs egresos.
          </p>
        </div>
        <Button
          onClick={handleDownloadCSV}
          disabled={!data || loading}
          className='bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
        >
          <Download className='w-4 h-4 mr-2' />
          Descargar Informe CSV
        </Button>
      </div>

      {loading ? (
        <div className='flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm'>
          <RefreshCw className='w-8 h-8 text-emerald-500 animate-spin mb-4' />
          <p className='text-slate-500 font-medium'>Generando métricas...</p>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Card de Saldo Total */}
          <Card className='md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg shadow-slate-900/20'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2'>
                <Wallet className='w-4 h-4 text-emerald-400' /> Saldo Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold tracking-tight mt-2'>
                $ {data?.balance?.toLocaleString('es-CO')}
              </div>
              <p className='text-xs text-slate-400 mt-2 flex items-center'>
                Refleja el balance total histórico
              </p>

              <div className='mt-6 space-y-3 border-t border-slate-700 pt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-slate-400 flex items-center gap-1'>
                    <ArrowUpRight className='w-4 h-4 text-emerald-400' /> Total
                    Ingresos
                  </span>
                  <span className='font-medium text-emerald-400'>
                    + ${' '}
                    {data?.movements
                      .filter((m: any) => m.type === 'INCOME')
                      .reduce((a: number, b: any) => a + b.amount, 0)
                      .toLocaleString('es-CO')}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-slate-400 flex items-center gap-1'>
                    <ArrowDownRight className='w-4 h-4 text-rose-400' /> Total
                    Egresos
                  </span>
                  <span className='font-medium text-rose-400'>
                    - ${' '}
                    {data?.movements
                      .filter((m: any) => m.type === 'EXPENSE')
                      .reduce((a: number, b: any) => a + b.amount, 0)
                      .toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Barras */}
          <Card className='md:col-span-2 shadow-sm border-slate-200'>
            <CardHeader>
              <CardTitle className='text-lg text-slate-800'>
                Flujo de Caja Histórico
              </CardTitle>
              <CardDescription>
                Comparativa mensual de Ingresos y Egresos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[300px] w-full mt-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#e2e8f0'
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow:
                          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar
                      dataKey='Ingresos'
                      fill='#10b981'
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    />
                    <Bar
                      dataKey='Egresos'
                      fill='#f43f5e'
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
