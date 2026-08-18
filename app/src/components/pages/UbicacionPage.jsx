import { useAppConfig } from '../../hooks/useAppConfig.js';

export default function UbicacionPage() {
  const { config } = useAppConfig();
  const location = config?.location || {};
  const address = location.address || 'Jarabacoa, La Vega, República Dominicana';
  const googleMapsUrl =
    location.googleMapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Jarabacoa%2C%20Rep%C3%BAblica%20Dominicana';
  const directionsUrl = location.latitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=Jarabacoa%2C%20Rep%C3%BAblica%20Dominicana`;

  return (
    <section className="section ubicacion-page">
      <div className="section-inner">
        <div className="ubicacion-layout">
          <div className="ubicacion-text">
            <h1 className="section-title">Ubicación</h1>
            <p className="section-text">
              Vista de la Rosa se encuentra en {address}, un entorno de
              montañas, naturaleza y clima fresco durante todo el año.
            </p>
            <p className="section-text ubicacion-secondary-text">
              Disfruta de vistas espectaculares y un ambiente privado y
              tranquilo, perfecto para descansar, compartir y realizar
              actividades especiales.
            </p>

            <div className="ubicacion-actions">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Abrir Google Maps
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Obtener indicaciones
              </a>
            </div>
          </div>
          <div className="ubicacion-map">
            <div className="map-frame">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  address,
                )}&output=embed`}
                title={`Mapa de ${address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
