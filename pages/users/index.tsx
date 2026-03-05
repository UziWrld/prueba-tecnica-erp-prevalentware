import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users as UsersIcon,
  Edit2,
  Shield,
  ShieldAlert,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import Head from 'next/head';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
};

export default function Users({ user }: { user: any }) {
  // Lista completa de usuarios obtenida desde la API
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Variables de estado para el modo "edición en línea" (Inline Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'ADMIN' | 'USER'>('USER');
  const [saving, setSaving] = useState(false);

  // Función para obtener la lista de usuarios. El backend (API) validará automáticamente
  // que el usuario que haga la petición tenga el rol 'ADMIN'.
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Activa el modo edición para un usuario específico, rellenando el formulario
  const handleEdit = (u: User) => {
    setEditingId(u.id);
    setEditName(u.name);
    setEditRole(u.role);
  };

  // Guarda los cambios (nombre o rol) enviando la petición PUT a la API
  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, role: editRole }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Protección adicional en el front-end: Si el usuario que ingresa no es ADMIN,
  // mostramos una pantalla de Acceso Denegado.
  // Esto complementa la protección que ya existe a nivel de servidor (API).
  if (user?.role !== 'ADMIN') {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200'>
        <ShieldAlert className='w-12 h-12 text-rose-500 mb-4' />
        <h2 className='text-xl font-bold text-slate-900 mb-2'>
          Acceso Denegado
        </h2>
        <p>No tienes los permisos necesarios para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Head>
        <title>Usuarios - PrevalentWare</title>
      </Head>

      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2'>
            <UsersIcon className='w-6 h-6 text-indigo-600' />
            Gestión de Usuarios
          </h2>
          <p className='text-sm text-slate-500 mt-1'>
            Administra los roles y el acceso a la plataforma.
          </p>
        </div>
      </div>

      <Card className='border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-indigo-600'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Usuario</th>
                <th className='px-6 py-4 font-semibold'>Correo</th>
                <th className='px-6 py-4 font-semibold'>Rol Asignado</th>
                <th className='px-6 py-4 font-semibold'>Fecha Registro</th>
                <th className='px-6 py-4 font-semibold text-right'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 bg-white'>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-12 text-center text-slate-500'
                  >
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2' />
                    Cargando usuarios...
                  </td>
                </tr>
              ) : (
                usersList.map((u) => {
                  const isEditing = editingId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors group ${isEditing ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}
                    >
                      <td className='px-6 py-4'>
                        {isEditing ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className='w-full px-2 py-1.5 text-sm border border-indigo-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500'
                          />
                        ) : (
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200'>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className='font-medium text-slate-900'>
                              {u.name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 text-slate-500'>{u.email}</td>
                      <td className='px-6 py-4'>
                        {isEditing ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as any)}
                            className='px-2 py-1.5 text-sm border border-indigo-200 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-indigo-500'
                          >
                            <option value='ADMIN'>Administrador</option>
                            <option value='USER'>Usuario Estándar</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${u.role === 'ADMIN'
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                : 'bg-slate-100 text-slate-800 border-slate-200'
                              }`}
                          >
                            {u.role === 'ADMIN' && (
                              <Shield className='w-3 h-3 mr-1' />
                            )}
                            {u.role === 'ADMIN' ? 'Admin' : 'Estándar'}
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-slate-500'>
                        {new Date(u.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        {isEditing ? (
                          <div className='flex items-center justify-end gap-2'>
                            <button
                              onClick={() => setEditingId(null)}
                              className='p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors'
                              title='Cancelar'
                            >
                              <X className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleSave(u.id)}
                              disabled={saving}
                              className='p-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-md transition-colors disabled:opacity-50'
                              title='Guardar'
                            >
                              <Check className='w-4 h-4' />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(u)}
                            className='p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors opacity-0 group-hover:opacity-100'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
