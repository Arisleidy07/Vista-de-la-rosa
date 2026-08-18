import OptimizedImage from '../ui/OptimizedImage.jsx';
import { formatPrice } from '../../lib/utils.js';

export default function VillaCard({ villa, onOpen }) {
  const mainImage = villa.images?.[0];

  return (
    <article className="villa-card">
      <div className="villa-card-media" onClick={onOpen}>
        {mainImage && (
          <OptimizedImage
            src={mainImage.url}
            alt={mainImage.alt || villa.title}
            className="villa-card-image"
            width={800}
            height={600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            cloudinaryOptions={{ widths: [400, 800, 1200] }}
          />
        )}
        <span className="villa-price-chip">
          {formatPrice(villa.price, villa.currency)} / noche
        </span>
      </div>
      <div className="villa-card-body">
        <h3 className="villa-card-title">{villa.title}</h3>
        <p className="villa-card-text">{villa.description}</p>
        <div className="villa-card-meta">
          <span>{villa.capacityLabel || `${villa.capacity} personas`}</span>
          <span>{villa.rooms} hab.</span>
          <span>{villa.baths} baños</span>
        </div>
        <button
          type="button"
          className="btn btn-primary villa-card-button"
          onClick={onOpen}
        >
          Ver detalles
        </button>
      </div>
    </article>
  );
}
