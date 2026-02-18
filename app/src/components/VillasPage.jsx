import React, { useMemo, useState, useEffect, useRef } from "react";
import { villas, blockDetailConfig, WHATSAPP_NUMBER } from "../data/villas";
import Lightbox from "./Lightbox";

const BLOCKS = ["todos", "1", "2", "3", "4", "5", "6", "7", "8"];

const AMENITY_ICON = {
  Cocina: "bi-egg-fried",
  Wifi: "bi-wifi",
  TV: "bi-tv",
  "A/C": "bi-snow",
  Parqueo: "bi-p-circle",
  Terraza: "bi-sun",
  BBQ: "bi-fire",
  Piscina: "bi-water",
  Jacuzzi: "bi-droplet",
  "Vista Montaña": "bi-geo-alt",
  Cafetera: "bi-cup-hot",
  Sala: "bi-couch",
  Balcón: "bi-window",
  Comedor: "bi-utensils",
  Abanico: "bi-fan",
};

function withBaseUrl(src) {
  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("/")) return `${assetBase}${src.slice(1)}`;
  return src;
}

function getGalleryForSelection(villa, selectionKey) {
  const cfg = blockDetailConfig[villa.block] || {};
  const variants = cfg.variants || null;
  const baseImages = villa.images || [];
  const videoUrl = villa.videoUrl || null;

  if (!variants) {
    return { images: baseImages, videoUrl };
  }

  if (selectionKey && selectionKey !== "all" && variants[selectionKey]) {
    const variantImages = variants[selectionKey].images || [];
    return { images: variantImages.slice(), videoUrl };
  }

  const combined = [...baseImages];
  Object.keys(variants).forEach((key) => {
    (variants[key].images || []).forEach((src) => {
      combined.push(src);
    });
  });

  return { images: combined, videoUrl };
}

function VillasFilters({ selectedBlock, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    selectedBlock === "todos" ? "Todos los bloques" : `Bloque ${selectedBlock}`;

  return (
    <div className="villas-filters">
      <div className="villas-filters-inner villas-filters-desktop">
        {BLOCKS.map((block) => (
          <button
            key={block}
            type="button"
            className={
              "chip-button" +
              (selectedBlock === block ? " chip-button-active" : "")
            }
            onClick={() => onChange(block)}
          >
            {block === "todos" ? "Todos los bloques" : `Bloque ${block}`}
          </button>
        ))}
      </div>

      <div className="villas-filters-mobile">
        <button
          type="button"
          className="villas-filters-mobile-button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>{currentLabel}</span>
          <span className="villas-filters-mobile-chevron">▾</span>
        </button>

        {isOpen && (
          <div
            className="villas-filters-mobile-menu"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="villas-filters-mobile-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="villas-filters-mobile-title">
                Selecciona un bloque
              </p>
              <div className="villas-filters-mobile-list">
                {BLOCKS.map((block) => {
                  const label =
                    block === "todos" ? "Todos los bloques" : `Bloque ${block}`;
                  const isActive = selectedBlock === block;
                  return (
                    <button
                      key={block}
                      type="button"
                      className={
                        "villas-filters-mobile-option" +
                        (isActive ? " villas-filters-mobile-option-active" : "")
                      }
                      onClick={() => {
                        onChange(block);
                        setIsOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VillaCard({ villa, onOpen }) {
  const mainImage =
    villa.images && villa.images.length ? withBaseUrl(villa.images[0]) : "";
  return (
    <article className="villa-card">
      <div className="villa-card-media">
        {mainImage && (
          <img
            src={mainImage}
            alt={`Villa ${villa.number}`}
            className="villa-card-image"
            loading="lazy"
            decoding="async"
            onClick={onOpen}
          />
        )}
        <span className="villa-chip">Bloque {villa.block}</span>
        <span className="villa-price-chip">${villa.price} / noche</span>
      </div>
      <div className="villa-card-body">
        <h3 className="villa-card-title">{villa.title}</h3>
        <p className="villa-card-text">{villa.description}</p>
        <div className="villa-card-meta">
          <span>{villa.capacity}</span>
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

function Gallery({
  images,
  videoUrl,
  activeIndex,
  onChangeIndex,
  onOpenLightbox,
}) {
  const media = [
    ...(videoUrl
      ? [
          {
            type: "video",
            src: withBaseUrl(videoUrl),
            thumb: images && images.length ? withBaseUrl(images[0]) : undefined,
          },
        ]
      : []),
    ...(images || []).map((src) => ({ type: "image", src: withBaseUrl(src) })),
  ];

  if (!media.length) return null;

  const safeIndex = Math.max(0, Math.min(activeIndex, media.length - 1));
  const active = media[safeIndex];

  const hasMultiple = media.length > 1;

  const thumbsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateThumbScrollState = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth } = el;
    const hasOverflow = scrollWidth - clientWidth > 1;
    // Si hay más miniaturas que espacio, mostramos flechas en ambos lados
    setCanScrollLeft(hasOverflow);
    setCanScrollRight(hasOverflow);
  };

  const handlePrev = () => {
    if (!hasMultiple) return;
    const nextIndex = (safeIndex - 1 + media.length) % media.length;
    onChangeIndex(nextIndex);
  };

  const scrollThumbs = (direction) => {
    const el = thumbsRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.8;
    const nextLeft =
      direction === "next" ? el.scrollLeft + delta : el.scrollLeft - delta;
    el.scrollTo({ left: nextLeft, behavior: "smooth" });
    window.setTimeout(updateThumbScrollState, 200);
  };

  useEffect(() => {
    updateThumbScrollState();
  }, [media.length]);

  useEffect(() => {
    const handleResize = () => updateThumbScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (!hasMultiple) return;
    const nextIndex = (safeIndex + 1) % media.length;
    onChangeIndex(nextIndex);
  };

  const handleOpen = () => {
    if (!onOpenLightbox) return;
    onOpenLightbox(Math.max(0, safeIndex));
  };

  return (
    <div className="villa-gallery">
      <div className="villa-gallery-main" onClick={handleOpen}>
        {active.type === "video" ? (
          active.src && String(active.src).includes("youtube") ? (
            <iframe
              src={active.src}
              className="villa-gallery-main-image yt-embed"
              title="Villa video"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={active.src}
              className="villa-gallery-main-image"
              controls
              playsInline
              preload="metadata"
              poster={active.thumb || undefined}
            />
          )
        ) : (
          <img
            src={active.src}
            alt={`Imagen ${safeIndex + 1}`}
            className="villa-gallery-main-image"
            loading="lazy"
            decoding="async"
          />
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              className="villa-gallery-arrow villa-gallery-prev"
              onClick={(event) => {
                event.stopPropagation();
                handlePrev();
              }}
              aria-label="Imagen anterior"
            >
              ←
            </button>
            <button
              type="button"
              className="villa-gallery-arrow villa-gallery-next"
              onClick={(event) => {
                event.stopPropagation();
                handleNext();
              }}
              aria-label="Imagen siguiente"
            >
              →
            </button>
          </>
        )}
      </div>
      <div className="villa-gallery-thumbs-row">
        {canScrollLeft && (
          <button
            type="button"
            className="thumbs-scroll-arrow thumbs-scroll-arrow-prev"
            onClick={() => scrollThumbs("prev")}
            aria-label="Desplazar miniaturas a la izquierda"
          >
            ‹
          </button>
        )}
        <div
          className="villa-gallery-thumbs"
          ref={thumbsRef}
          onScroll={updateThumbScrollState}
        >
          {media.map((item, idx) => (
            <button
              key={`${item.src}-${idx}`}
              type="button"
              className={
                "villa-thumb" + (idx === safeIndex ? " villa-thumb-active" : "")
              }
              onClick={() => onChangeIndex(idx)}
            >
              {item.type === "video" ? (
                <div className="villa-thumb-video">
                  <span>▶</span>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={`Miniatura ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </button>
          ))}
        </div>
        {canScrollRight && (
          <button
            type="button"
            className="thumbs-scroll-arrow thumbs-scroll-arrow-next"
            onClick={() => scrollThumbs("next")}
            aria-label="Desplazar miniaturas a la derecha"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

function VillaDetailsModal({ villa, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [variantKey, setVariantKey] = useState("all");

  useEffect(() => {
    setActiveIndex(0);
    setVariantKey("all");
  }, [villa]);

  const cfg = blockDetailConfig[villa.block] || {};
  const capacity = cfg.capacity || villa.capacity || "Consultar";
  const rooms = cfg.rooms || villa.rooms || "Consultar";
  const baths = cfg.baths || villa.baths || "Consultar";
  const amenities = cfg.amenities || villa.amenities || [];
  const variants = cfg.variants || null;
  const hasVariants = variants && (variants.a || variants.b);

  const gallery = useMemo(
    () => getGalleryForSelection(villa, hasVariants ? variantKey : "all"),
    [villa, variantKey, hasVariants],
  );

  const message = encodeURIComponent(
    `Hola, quiero reservar la ${villa.title} en Vista de la Rosa`,
  );
  const phone = WHATSAPP_NUMBER || "18293410707";
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel villa-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2 className="modal-title">{villa.title}</h2>
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
            <Gallery
              images={gallery.images}
              videoUrl={gallery.videoUrl}
              activeIndex={activeIndex}
              onChangeIndex={setActiveIndex}
              onOpenLightbox={(index) => {
                setActiveIndex(index || 0);
                setIsLightboxOpen(true);
              }}
            />
          </div>
          <div className="villa-modal-info">
            <section className="villa-modal-section villa-modal-about">
              <h3 className="villa-modal-title-main">{villa.title}</h3>
              {hasVariants && variants && (
                <div id="modalVariants">
                  <div className="variant-selector">
                    {(() => {
                      const items = [];
                      const coverThumb =
                        (villa.images && villa.images.length
                          ? villa.images[0]
                          : null) ||
                        (variants.a && variants.a.thumb) ||
                        "";

                      items.push(
                        <button
                          type="button"
                          key="all"
                          className={
                            "variant-card variant-card--all" +
                            (variantKey === "all" ? " active" : "")
                          }
                          onClick={() => {
                            setVariantKey("all");
                            setActiveIndex(0);
                          }}
                        >
                          <span className="variant-thumb">
                            {coverThumb ? (
                              <img
                                src={withBaseUrl(coverThumb)}
                                alt="Ver bloque completo"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <span className="variant-thumb-fallback" />
                            )}
                          </span>
                          <span className="variant-label">
                            Ver bloque completo
                            <span className="variant-meta">
                              Todas las fotos
                            </span>
                          </span>
                        </button>,
                      );

                      if (variants.a) {
                        items.push(
                          <button
                            type="button"
                            key="a"
                            className={
                              "variant-card" +
                              (variantKey === "a" ? " active" : "")
                            }
                            onClick={() => {
                              setVariantKey("a");
                              setActiveIndex(0);
                            }}
                          >
                            <span className="variant-thumb">
                              {variants.a.thumb ? (
                                <img
                                  src={withBaseUrl(variants.a.thumb)}
                                  alt={variants.a.label}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <span className="variant-thumb-fallback" />
                              )}
                            </span>
                            <span className="variant-label">
                              {variants.a.label}
                              <span className="variant-meta">Galería A</span>
                            </span>
                          </button>,
                        );
                      }

                      if (variants.b) {
                        items.push(
                          <button
                            type="button"
                            key="b"
                            className={
                              "variant-card" +
                              (variantKey === "b" ? " active" : "")
                            }
                            onClick={() => {
                              setVariantKey("b");
                              setActiveIndex(0);
                            }}
                          >
                            <span className="variant-thumb">
                              {variants.b.thumb ? (
                                <img
                                  src={withBaseUrl(variants.b.thumb)}
                                  alt={variants.b.label}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <span className="variant-thumb-fallback" />
                              )}
                            </span>
                            <span className="variant-label">
                              {variants.b.label}
                              <span className="variant-meta">Galería B</span>
                            </span>
                          </button>,
                        );
                      }

                      return items;
                    })()}
                  </div>
                </div>
              )}
              <p className="villa-modal-text">{villa.description}</p>
            </section>

            <section className="villa-modal-section villa-modal-price-box">
              <div className="villa-price-box-inner">
                <span className="villa-price-label">Precio por noche</span>
                <p className="villa-price-large">
                  ${villa.price}
                  <span className="villa-price-unit">/noche</span>
                </p>
              </div>
            </section>

            {amenities && amenities.length > 0 && (
              <section className="villa-modal-section">
                <h3 className="villa-modal-section-title">
                  Servicios y equipamiento
                </h3>
                <div className="villa-modal-amenities">
                  {amenities.map((item) => {
                    const iconClass = AMENITY_ICON[item] || "bi-check2-circle";
                    return (
                      <span key={item} className="villa-amenity-chip">
                        <i className={`bi ${iconClass}`} aria-hidden="true" />
                        <span>{item}</span>
                      </span>
                    );
                  })}
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
                  <span className="villa-detail-value">{capacity}</span>
                </div>
                <div className="villa-detail-row">
                  <span className="villa-detail-label">
                    <i className="bi bi-door-closed" aria-hidden="true" />
                    <span>Habitaciones</span>
                  </span>
                  <span className="villa-detail-value">{rooms}</span>
                </div>
                <div className="villa-detail-row">
                  <span className="villa-detail-label">
                    <i className="bi bi-droplet" aria-hidden="true" />
                    <span>Baños</span>
                  </span>
                  <span className="villa-detail-value">{baths}</span>
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
        <Lightbox
          title={villa.title}
          initialIndex={activeIndex}
          items={(() => {
            const images = gallery.images || [];
            const video = gallery.videoUrl
              ? withBaseUrl(gallery.videoUrl)
              : null;
            const videoThumb = images[0] ? withBaseUrl(images[0]) : null;
            const media = [
              ...(video
                ? [{ type: "video", src: video, thumb: videoThumb }]
                : []),
              ...images.map((src) => ({
                type: "image",
                src: withBaseUrl(src),
              })),
            ];
            return media;
          })()}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

export default function VillasPage() {
  const [selectedBlock, setSelectedBlock] = useState("todos");
  const [activeVilla, setActiveVilla] = useState(null);

  const filteredVillas = useMemo(() => {
    if (selectedBlock === "todos") return villas;
    return villas.filter((v) => String(v.block) === selectedBlock);
  }, [selectedBlock]);

  return (
    <section className="section villas-page">
      <div className="section-inner">
        <header className="villas-header">
          <div>
            <h1 className="section-title">Nuestras Villas</h1>
            <p className="section-text">
              Explora las distintas villas por bloque y descubre la opción ideal
              para tu estadía en Jarabacoa.
            </p>
          </div>
        </header>

        <VillasFilters
          selectedBlock={selectedBlock}
          onChange={setSelectedBlock}
        />

        {filteredVillas.length === 0 ? (
          <div className="villas-empty">
            <p>No hay villas disponibles para este bloque.</p>
          </div>
        ) : (
          <div className="villas-grid">
            {filteredVillas.map((villa) => (
              <VillaCard
                key={villa.id}
                villa={villa}
                onOpen={() => setActiveVilla(villa)}
              />
            ))}
          </div>
        )}

        {activeVilla && (
          <VillaDetailsModal
            villa={activeVilla}
            onClose={() => setActiveVilla(null)}
          />
        )}
      </div>
    </section>
  );
}
