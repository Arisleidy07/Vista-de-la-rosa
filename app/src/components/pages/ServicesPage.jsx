import { useServices } from '../../hooks/useServices.js';
import ServiceCard from '../services/ServiceCard.jsx';

export default function ServicesPage() {
  const { services, loading } = useServices();

  if (loading) {
    return (
      <section className="section services-page">
        <div className="section-inner">
          <div className="page-loader" aria-live="polite">
            <div className="page-loader-spinner" />
            <span className="sr-only">Cargando servicios...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section services-page">
      <div className="section-inner">
        <header className="services-header">
          <h1 className="section-title">Amenidades y servicios</h1>
          <p className="section-text">
            Disfruta de piscina, jacuzzi, áreas sociales, comedor, cocina
            equipada y mucho más, en un entorno natural único en Jarabacoa.
          </p>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.key || service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
