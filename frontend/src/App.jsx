import { useState, useEffect } from 'react';
import { Leaf, LayoutDashboard, PlusCircle, MapPin, Users, LogOut } from 'lucide-react';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import PuntosRecoleccion from './pages/PuntosRecoleccion';
import RegistroResiduos from './pages/RegistroResiduos';
import GestionUsuarios from './pages/GestionUsuarios';

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [puntosBogota, setPuntosBogota] = useState([]);

  // Cargar datos reales desde MySQL al iniciar sesión
  const cargarDatosReales = async () => {
    try {
      const [resPuntos, resResiduos, resUsuarios] = await Promise.all([
        fetch(`${API_URL}/puntos`),
        fetch(`${API_URL}/residuos`),
        fetch(`${API_URL}/usuarios`),
      ]);
      if (resPuntos.ok) setPuntosBogota(await resPuntos.json());
      if (resResiduos.ok) setRegistros(await resResiduos.json());
      if (resUsuarios.ok) setUsuarios(await resUsuarios.json());
    } catch (error) {
      console.error('Error conectando con el backend:', error);
    }
  };

  useEffect(() => {
    if (usuarioActivo) {
      cargarDatosReales();
    }
  }, [usuarioActivo]);

  if (!usuarioActivo) {
    return (
      <div className="min-h-screen bg-[#F1F5F2] flex flex-col justify-center items-center p-4 font-sans">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#237A30]">EcoRed Bogotá</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión y Seguimiento de Residuos Reciclables</p>
        </div>

        {vistaActual === 'registro' ? (
          <Registro apiUrl={API_URL} onIrALogin={() => setVistaActual('login')} />
        ) : (
          <Login
            apiUrl={API_URL}
            onLoginSuccess={(user, token) => {
              localStorage.setItem('ecored_token', token);
              setUsuarioActivo(user);
              setVistaActual('dashboard');
            }}
            onIrARegistro={() => setVistaActual('registro')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F2] font-sans text-gray-800">
      <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#237A30]">
            <Leaf size={20} />
          </div>
          <span className="font-bold text-lg text-[#237A30]">EcoRed Bogotá</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVistaActual('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              vistaActual === 'dashboard' ? 'bg-[#237A30] text-white' : 'text-gray-600 hover:bg-[#E8F5E9]'
            }`}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>

          <button
            onClick={() => setVistaActual('residuos')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              vistaActual === 'residuos' ? 'bg-[#237A30] text-white' : 'text-gray-600 hover:bg-[#E8F5E9]'
            }`}
          >
            <PlusCircle size={16} /> Registrar Residuo
          </button>

          <button
            onClick={() => setVistaActual('mapa')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              vistaActual === 'mapa' ? 'bg-[#237A30] text-white' : 'text-gray-600 hover:bg-[#E8F5E9]'
            }`}
          >
            <MapPin size={16} /> Puntos de Recolección
          </button>

          {usuarioActivo.rol === 'Administrador' && (
            <button
              onClick={() => setVistaActual('usuarios')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                vistaActual === 'usuarios' ? 'bg-[#237A30] text-white' : 'text-gray-600 hover:bg-[#E8F5E9]'
              }`}
            >
              <Users size={16} /> Usuarios
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-[#E8F5E9] text-[#237A30] px-2.5 py-1 rounded-full font-medium">
            {usuarioActivo.nombre} ({usuarioActivo.rol})
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('ecored_token');
              setUsuarioActivo(null);
              setVistaActual('login');
            }}
            className="text-gray-500 hover:text-red-600 p-1.5 rounded-lg cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {vistaActual === 'dashboard' && (
          <Dashboard registros={registros} usuarios={usuarios} puntos={puntosBogota} />
        )}
        {vistaActual === 'residuos' && (
          <RegistroResiduos
            apiUrl={API_URL}
            usuarioId={usuarioActivo.id}
            puntos={puntosBogota}
            onRegistroGuardado={async () => {
              await cargarDatosReales();
              setVistaActual('dashboard');
            }}
          />
        )}
        {vistaActual === 'mapa' && <PuntosRecoleccion puntos={puntosBogota} />}
        {vistaActual === 'usuarios' && (
          <GestionUsuarios apiUrl={API_URL} usuarios={usuarios} onRolActualizado={cargarDatosReales} />
        )}
      </main>
    </div>
  );
}