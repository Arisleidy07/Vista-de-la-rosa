import React, { useEffect, useState, useRef } from "react";

// Lightbox genérico para imágenes y videos, reutilizable en villas y servicios
export default function Lightbox({ items, initialIndex = 0, title, onClose }) {
  const [index, setIndex] = useState(initialIndex || 0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    setIndex(initialIndex || 0);
  }, [initialIndex, items]);

  if (!items || !items.length) return null;

  const safeIndex = Math.max(0, Math.min(index, items.length - 1));
  const active = items[safeIndex];
  const countLabel =
    items.length > 1 ? `${safeIndex + 1} / ${items.length}` : null;

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

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  // Mínima distancia de swipe (en px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }
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

  // Precarga simple de las imágenes vecinas para evitar parpadeos
  useEffect(() => {
    if (!items || items.length <= 1) return;

    const neighbors = [index - 1, index + 1];
    neighbors.forEach((i) => {
      const normalized = (i + items.length) % items.length;
      const item = items[normalized];
      if (!item || item.type !== "image") return;
      const img = new Image();
      img.src = item.src;
    });
  }, [index, items]);

  useEffect(() => {
    updateThumbScrollState();
  }, [items.length]);

  useEffect(() => {
    const handleResize = () => updateThumbScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bloquear scroll del body mientras el lightbox está abierto
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        goPrev();
      } else if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div
        className="lightbox-inner"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="lightbox-header">
          <div className="lightbox-title-group">
            {title && <h3 className="lightbox-title">{title}</h3>}
            {countLabel && (
              <span className="lightbox-counter">{countLabel}</span>
            )}
          </div>
          <button
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div
          className="lightbox-main"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {active.type === "video" ? (
            <video
              src={active.src}
              className="lightbox-main-media"
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={active.thumb || undefined}
            />
          ) : (
            <img
              src={active.src}
              alt={active.alt || "Imagen"}
              className="lightbox-main-media"
            />
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-arrow lightbox-prev"
                onClick={goPrev}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-arrow lightbox-next"
                onClick={goNext}
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="lightbox-thumbs-row">
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
              className="lightbox-thumbs"
              ref={thumbsRef}
              onScroll={updateThumbScrollState}
            >
              {items.map((item, idx) => (
                <button
                  key={`${item.src}-${idx}`}
                  type="button"
                  className={
                    "lightbox-thumb" +
                    (idx === safeIndex ? " lightbox-thumb-active" : "")
                  }
                  onClick={() => setIndex(idx)}
                >
                  {item.type === "video" ? (
                    <div className="lightbox-thumb-video">
                      {item.thumb && (
                        <img
                          src={item.thumb}
                          alt={item.alt || "Vista previa del video"}
                        />
                      )}
                      <span className="lightbox-thumb-video-icon">▶</span>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt || `Miniatura ${idx + 1}`}
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
        )}
      </div>
    </div>
  );
}
