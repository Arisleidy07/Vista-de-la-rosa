import React from 'react';

export default function UbicacionPage() {
  return (
    <section className="section ubicacion-page">
      <div className="section-inner">
        <div className="ubicacion-layout">
          <div className="ubicacion-text">
            <h1 className="section-title">Ubicación</h1>
            <p className="section-text">
              Vista de la Rosa se encuentra en Jarabacoa, La Vega, República
              Dominicana; un entorno de montañas, naturaleza y clima fresco
              durante todo el año.
            </p>
            <p className="section-text ubicacion-secondary-text">
              Disfruta de vistas espectaculares y un ambiente privado y tranquilo,
              perfecto para descansar, compartir y realizar actividades
              especiales.
            </p>
          </div>
          <div className="ubicacion-map">
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps?q=Jarabacoa%2C%20Rep%C3%BAblica%20Dominicana&output=embed"
                title="Mapa de Jarabacoa, República Dominicana"
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
