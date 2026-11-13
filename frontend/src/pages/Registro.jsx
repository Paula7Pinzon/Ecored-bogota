import { useState } from 'react';
import { Leaf } from 'lucide-react';

export default function Registro({ apiUrl, onIrALogin }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Ciudadano');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError('');
    try {
      const resp = await fetch(`${apiUrl}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password, rol }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Error al registrar usuario.');
      } else {
        setExito('¡Cuenta creada en MySQL! Redirigiendo al login...');
        setTimeout(() => onIrALogin(), 1500);
      }
    } catch {
      setError('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#237A30] mb-3">
          <Leaf size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Crear cuenta</h2>
        <p className="text-sm text-gray-500">Únete a la red de reciclaje en Bogotá</p>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs">{error}</div>}
      {exito && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-xs font-medium">{exito}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo</label>
          <input
            type="text"
            placeholder="Ej. Paula Pinzón"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#237A30]"
          />
        </div>

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
          <label className="block text-xs font-medium text-gray-600 mb-1">Rol en la comunidad</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#237A30]"
          >
            <option value="Ciudadano">Ciudadano</option>
            <option value="Reciclador">Reciclador</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#237A30]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#237A30] hover:bg-[#1b6125] text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer"
        >
          Registrarme
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <button onClick={onIrALogin} className="text-[#237A30] font-semibold hover:underline cursor-pointer">
          Inicia sesión
        </button>
      </p>
    </div>
  );
}