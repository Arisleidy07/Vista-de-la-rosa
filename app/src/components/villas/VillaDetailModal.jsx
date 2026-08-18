import { useState, useMemo, useEffect } from "react";
import { useAppConfig } from "../../hooks/useAppConfig.js";
import VillaGallery from "./VillaGallery.jsx";
import OptimizedImage from "../ui/OptimizedImage.jsx";
import { AMENITY_ICON } from "../../lib/constants.js";
import { cn, formatPrice } from "../../lib/utils.js";

export default function VillaDetailModal({ villa, onClose }) {
  const { config } = useAppConfig();
  const [variantKey, setVariantKey] = useState("all");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const variants = villa.variants;
  const hasVariants = variants && Object.keys(variants).length > 0;

  const whatsappNumber = config?.contact?.whatsapp || "18293410707";
  const message = encodeURIComponent(
    `Hola, quiero reservar la ${villa.title} en Vista de la Rosa`,
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  const variantList = useMemo(() => {
    if (!variants) return [];
    return Object.entries(variants).map(([key, data]) => ({ key, ...data }));
  }, [variants]);

  const coverThumb = useMemo(() => {
    if (!hasVariants) return null;
    return villa.images?.[0]?.url || variants[Object.keys(variants)[0]]?.thumb;
  }, [hasVariants, villa.images, variants]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel villa-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="villa-modal-title"
      >
        <header className="modal-header">
          <div>
            <h2 id="villa-modal-title" className="modal-title">
              {villa.title}
            </h2>
            <p className="modal-subtitle">Villa #{villa.number}</p>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className="modal-body villa-modal-body">
          <div className="villa-modal-media">
            <VillaGallery
              villa={villa}
              variantKey={variantKey}
              onOpenLightbox={(index) => {
                setLightboxIndex(index || 0);
                setIsLightboxOpen(true);
              }}
            />
          </div>

          <div className="villa-modal-info">
            <section className="villa-modal-section villa-modal-about">
              <h3 className="villa-modal-title-main">{villa.title}</h3>

              {hasVariants && (
                <div className="variant-selector">
                  <button
                    type="button"
                    className={cn(
                      "variant-card variant-card--all",
                      variantKey === "all" && "active",
                    )}
                    onClick={() => setVariantKey("all")}
                  >
                    <span className="variant-thumb">
                      {coverThumb ? (
                        <OptimizedImage
                          src={coverThumb}
                          alt="Ver bloque completo"
                          width={80}
                          height={60}
                          loading="eager"
                        />
                      ) : (
                        <span className="variant-thumb-fallback" />
                      )}
                    </span>
                    <span className="variant-label">
                      Ver bloque completo
                      <span className="variant-meta">Todas las fotos</span>
                    </span>
                  </button>

                  {variantList.map((variant) => (
                    <button
                      key={variant.key}
                      type="button"
                      className={cn(
                        "variant-card",
                        variantKey === variant.key && "active",
                      )}
                      onClick={() => setVariantKey(variant.key)}
                    >
                      <span className="variant-thumb">
                        {variant.thumb ? (
                          <OptimizedImage
                            src={variant.thumb}
                            alt={variant.label}
                            width={80}
                            height={60}
                            loading="eager"
                          />
                        ) : (
                          <span className="variant-thumb-fallback" />
                        )}
                      </span>
                      <span className="variant-label">{variant.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <p className="villa-modal-text">{villa.description}</p>
            </section>

            <section className="villa-modal-section villa-modal-price-box">
              <div className="villa-price-box-inner">
                <span className="villa-price-label">Precio por noche</span>
                <p className="villa-price-large">
                  {formatPrice(villa.price, villa.currency)}
                  <span className="villa-price-unit">/noche</span>
                </p>
              </div>
            </section>

            {villa.amenities?.length > 0 && (
              <section className="villa-modal-section">
                <h3 className="villa-modal-section-title">
                  Servicios y equipamiento
                </h3>
                <div className="villa-modal-amenities">
                  {villa.amenities.map((item) => (
                    <span key={String(item)} className="villa-amenity-chip">
                      <i
                        className={`bi ${AMENITY_ICON[item] || "bi-check2-circle"}`}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="villa-modal-section villa-modal-details">
              <h3 className="villa-modal-section-title">
                Detalles de la Villa
              </h3>
              <div className="villa-details-list">
                <div className="villa-detail-row">
                  <span className="villa-detail-label">
                    <i className="bi bi-people" aria-hidden="true" />
                    <span>Capacidad</span>
                  </span>
                  <span className="villa-detail-value">
                    {villa.capacityLabel || `${villa.capacity} personas`}
                  </span>
                </div>
                <div className="villa-detail-row">
                  <span className="villa-detail-label">
                    <i className="bi bi-door-closed" aria-hidden="true" />
                    <span>Habitaciones</span>
                  </span>
                  <span className="villa-detail-value">{villa.rooms}</span>
                </div>
                <div className="villa-detail-row">
                  <span className="villa-detail-label">
                    <i className="bi bi-droplet" aria-hidden="true" />
                    <span>Baños</span>
                  </span>
                  <span className="villa-detail-value">{villa.baths}</span>
                </div>
              </div>
            </section>

            <section className="villa-modal-section">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary villa-whatsapp-btn"
              >
                Reservar por WhatsApp
              </a>
            </section>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <LightboxWrapper
          villa={villa}
          variantKey={variantKey}
          initialIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

// Inline lightbox to avoid importing the old heavy component; we'll wire it up below.
function LightboxWrapper({ villa, variantKey, initialIndex, onClose }) {
  const { images, video } = getGalleryMediaRaw(villa, variantKey);
  const media = [
    ...(video
      ? [{ type: "video", src: video.embedUrl, thumb: images[0]?.url }]
      : []),
    ...images.map((img) => ({ type: "image", src: img.url })),
  ];

  // Lazy load the existing Lightbox only when needed.
  const [Lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("../Lightbox.jsx").then((mod) => {
      if (mounted) setLightbox(() => mod.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Lightbox) {
    return <div className="modal-backdrop" onClick={onClose} />;
  }

  return (
    <Lightbox
      title={villa.title}
      initialIndex={initialIndex}
      items={media}
      onClose={onClose}
    />
  );
}

function getGalleryMediaRaw(villa, variantKey) {
  const variants = villa.variants;
  const baseImages = villa.images || [];
  const video = villa.video;

  if (!variants) return { images: baseImages, video };

  if (variantKey && variantKey !== "all" && variants[variantKey]) {
    return { images: variants[variantKey].images || [], video };
  }

  const combined = [...baseImages];
  Object.keys(variants).forEach((key) => {
    (variants[key].images || []).forEach((img) => {
      if (!combined.find((i) => i.url === img.url)) combined.push(img);
    });
  });
  return { images: combined, video };
}
