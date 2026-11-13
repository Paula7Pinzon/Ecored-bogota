import { useState } from 'react';

export default function RegistroResiduos({ apiUrl, usuarioId, puntos, onRegistroGuardado }) {
  const [tipo, setTipo] = useState('Plástico');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idPunto, setIdPunto] = useState(puntos.length > 0 ? puntos.id : 1);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(cantidad);
    if (isNaN(num) || num <= 0) {
      setError('La cantidad en kilogramos debe ser un número mayor que 0.');
      return;
    }

    setError('');
    setGuardando(true);
    try {
      const resp = await fetch(`${apiUrl}/residuos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          tipo,
          cantidad: num,
          descripcion: descripcion.trim(),
          id_punto: Number(idPunto),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Error al guardar el residuo.');
      } else {
        await onRegistroGuardado();
      }
    } catch {
      setError('No se pudo conectar con el servidor backend.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Nuevo Registro de Residuos</h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de residuo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#237A30]"
          >
            <option value="Plástico">Plástico</option>
            <option value="Papel">Papel</option>
            <option value="Vidrio">Vidrio</option>
            <option value="Metal">Metal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad (kg)</label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#237A30]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
          <textarea
            rows="3"
            placeholder="Describe los residuos..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#237A30]"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Punto de recolección</label>
          <select
            value={idPunto}
            onChange={(e) => setIdPunto(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#237A30]"
          >
            {puntos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} - {p.direccion}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full bg-[#237A30] hover:bg-[#1b6125] text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer disabled:opacity-60"
        >
          {guardando ? 'Guardando en MySQL...' : 'Guardar registro'}
        </button>
      </form>
    </div>
  );
}