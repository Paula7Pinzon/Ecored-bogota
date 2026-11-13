import { useState } from 'react';
import { Leaf } from 'lucide-react';

export default function Login({ apiUrl, onLoginSuccess, onIrARegistro }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo || !password) {
      setError('Por favor ingresa correo y contraseña.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const resp = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Credenciales incorrectas.');
      } else {
        onLoginSuccess(data.usuario, data.token);
      }
    } catch {
      setError('No se pudo conectar con el servidor backend.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#237A30] mb-3">
          <Leaf size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Bienvenido</h2>
        <p className="text-sm text-gray-500">Ingresa a tu cuenta EcoRed</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#237A30]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#237A30]"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-[#237A30] hover:bg-[#1b6125] text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer disabled:opacity-60"
        >
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="mt-5 text-center space-y-2">
        <p className="text-xs text-gray-600">
          ¿No tienes cuenta?{' '}
          <button onClick={onIrARegistro} className="text-[#237A30] font-semibold hover:underline cursor-pointer">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}