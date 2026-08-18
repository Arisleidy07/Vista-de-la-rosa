import ServiceGallery from './ServiceGallery.jsx';

export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-icon">
        <i className={service.iconClass} aria-hidden="true" />
      </div>
      <h3 className="service-title">{service.name}</h3>
      <p className="service-text">{service.description}</p>
      <ServiceGallery service={service} />
    </article>
  );
}
