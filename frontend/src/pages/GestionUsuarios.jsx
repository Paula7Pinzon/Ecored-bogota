export default function GestionUsuarios({ apiUrl, usuarios, onRolActualizado }) {
  const cambiarRol = async (id, nuevoRol) => {
    try {
      const resp = await fetch(`${apiUrl}/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      if (resp.ok) {
        await onRolActualizado();
      }
    } catch (error) {
      console.error('Error al actualizar rol:', error);
    }
  };

  const getBadgeStyle = (rol) => {
    if (rol === 'Ciudadano') return 'bg-[#E8F5E9] text-[#237A30]';
    if (rol === 'Reciclador') return 'bg-[#FFF3E0] text-[#E65100]';
    return 'bg-[#E3F2FD] text-[#1565C0]';
  };

  const getIniciales = (nombre) =>
    nombre
      .split(' ')
      .map((n) => n)
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <span className="text-xs font-medium bg-[#E8F5E9] text-[#237A30] px-3 py-1 rounded-full">
          {usuarios.length} usuarios
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
              <th className="py-3 px-2 font-medium">Nombre</th>
              <th className="py-3 px-2 font-medium">Correo</th>
              <th className="py-3 px-2 font-medium">Rol</th>
              <th className="py-3 px-2 font-medium text-right">Cambiar Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#237A30] text-white flex items-center justify-center text-xs font-bold">
                    {getIniciales(user.nombre)}
                  </div>
                  <span className="font-medium text-gray-800">{user.nombre}</span>
                </td>
                <td className="py-3.5 px-2 text-gray-500 text-xs">{user.correo}</td>
                <td className="py-3.5 px-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${getBadgeStyle(user.rol)}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <select
                    value={user.rol}
                    onChange={(e) => cambiarRol(user.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 focus:outline-none focus:border-[#237A30]"
                  >
                    <option value="Ciudadano">Ciudadano</option>
                    <option value="Reciclador">Reciclador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}