export default function Dashboard({ registros, usuarios, puntos }) {
  const totalKg = registros.reduce((acc, item) => acc + Number(item.cantidad), 0);
  const hoyStr = new Date().toISOString().split('T')[0];
  const hoyKg = registros
    .filter((r) => r.fecha === hoyStr)
    .reduce((acc, item) => acc + Number(item.cantidad), 0);

  // Cálculo real de porcentajes por categoría
  const categorias = ['Plástico', 'Papel', 'Vidrio', 'Metal'];
  const totalesCat = categorias.map((cat) => {
    const suma = registros
      .filter((r) => r.tipo === cat)
      .reduce((acc, r) => acc + Number(r.cantidad), 0);
    const porcentaje = totalKg > 0 ? Math.round((suma / totalKg) * 100) : 0;
    return { nombre: cat, kg: suma, porcentaje };
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        <span className="text-xs text-gray-400">Última actualización: Hoy</span>
      </div>

      {/* 4 Tarjetas KPI idénticas al prototipo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total recolectado</p>
          <p className="text-2xl font-bold text-[#237A30] mt-1">{totalKg.toLocaleString()} kg</p>
        </div>

        <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Recolectado hoy</p>
          <p className="text-2xl font-bold text-[#237A30] mt-1">{hoyKg} kg</p>
        </div>

        <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Usuarios activos</p>
          <p className="text-2xl font-bold text-[#237A30] mt-1">{usuarios.length}</p>
        </div>

        <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Puntos de recolección</p>
          <p className="text-2xl font-bold text-[#237A30] mt-1">{puntos.length}</p>
        </div>
      </div>

      {/* Sección inferior de gráficos y distribución */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Últimos residuos registrados (kg)</h3>
          <div className="space-y-3">
            {registros.slice(0, 5).map((reg) => (
              <div key={reg.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                <div>
                  <span className="font-medium text-gray-800">{reg.tipo}</span>
                  <p className="text-xs text-gray-400">{reg.punto}</p>
                </div>
                <span className="font-bold text-[#237A30]">{reg.cantidad} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Tipos de residuos (%)</h3>
          <div className="space-y-3">
            {totalesCat.map((cat, index) => {
              const colores = ['bg-[#237A30]', 'bg-[#4CAF50]', 'bg-[#81C784]', 'bg-[#A5D6A7]'];
              return (
                <div key={cat.nombre}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{cat.nombre}</span>
                    <span className="text-gray-500">{cat.porcentaje}% ({cat.kg} kg)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${colores[index]} h-2.5 rounded-full transition-all`}
                      style={{ width: `${cat.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
