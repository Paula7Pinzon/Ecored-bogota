import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Crear marcador circular verde numerado idéntico al prototipo de Figma
const crearMarcadorNumerado = (numero) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background-color: #237A30;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${numero}</div>`,
    iconSize: Array(28, 28),
    iconAnchor: Array(14, 14),
  });

export default function PuntosRecoleccion({ puntos }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Puntos de Recolección</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa interactivo de Bogotá */}
        <div className="lg:col-span-2 h-80 rounded-xl overflow-hidden border border-gray-200 z-0">
          <MapContainer center={Array(4.665, -74.09)} zoom={12} className="h-full w-full">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {puntos.map((punto, index) => (
              <Marker
                key={punto.id}
                position={Array(Number(punto.lat), Number(punto.lng))}
                icon={crearMarcadorNumerado(index + 1)}
              >
                <Popup>
                  <strong>{punto.nombre}</strong>
                  <br />
                  {punto.direccion}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Lista lateral numerada idéntica al prototipo */}
        <div className="space-y-3">
          {puntos.map((punto, index) => (
            <div
              key={punto.id}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-[#F8FAF8] hover:border-[#237A30] transition"
            >
              <div className="w-7 h-7 rounded-full bg-[#237A30] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{punto.nombre}</h3>
                <p className="text-xs text-gray-500">{punto.direccion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}