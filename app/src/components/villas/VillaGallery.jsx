import { useRef, useState, useEffect } from 'react';
import OptimizedImage from '../ui/OptimizedImage.jsx';
import VideoFacade from '../ui/VideoFacade.jsx';
import { cn } from '../../lib/utils.js';

function getGalleryMedia(villa, variantKey) {
  const variants = villa.variants;
  const baseImages = villa.images || [];
  const video = villa.video;

  if (!variants) {
    return { images: baseImages, video };
  }

  if (variantKey && variantKey !== 'all' && variants[variantKey]) {
    return { images: variants[variantKey].images || [], video };
  }

  const combined = [...baseImages];
  Object.keys(variants).forEach((key) => {
    (variants[key].images || []).forEach((img) => {
      if (!combined.find((i) => i.url === img.url)) {
        combined.push(img);
      }
    });
  });
  return { images: combined, video };
}

export function useGalleryMedia(villa, variantKey = 'all') {
  const [index, setIndex] = useState(0);
  const { images, video } = getGalleryMedia(villa, variantKey);

  useEffect(() => {
    setIndex(0);
  }, [villa.id, variantKey]);

  const media = [
    ...(video ? [{ type: 'video', video }] : []),
    ...images.map((img) => ({ type: 'image', image: img })),
  ];

  const safeIndex = Math.max(0, Math.min(index, media.length - 1));
  const active = media[safeIndex];

  return { media, activeIndex: safeIndex, active, setIndex };
}

export default function VillaGallery({ villa, variantKey = 'all', onOpenLightbox }) {
  const thumbsRef = useRef(null);
  const { media, activeIndex, active, setIndex } = useGalleryMedia(villa, variantKey);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hasMultiple = media.length > 1;

  const updateScrollState = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth - el.clientWidth > 1;
    setCanScrollLeft(hasOverflow);
    setCanScrollRight(hasOverflow);
  };

  useEffect(() => {
    updateScrollState();
  }, [media.length]);

  useEffect(() => {
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollThumbs = (direction) => {
    const el = thumbsRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'next' ? delta : -delta, behavior: 'smooth' });
    window.setTimeout(updateScrollState, 200);
  };

  const handlePrev = () => {
    if (!hasMultiple) return;
    setIndex((activeIndex - 1 + media.length) % media.length);
  };

  const handleNext = () => {
    if (!hasMultiple) return;
    setIndex((activeIndex + 1) % media.length);
  };

  const handleOpen = () => {
    if (onOpenLightbox) onOpenLightbox(Math.max(0, activeIndex));
  };

  return (
    <div className="villa-gallery">
      <div className="villa-gallery-main" onClick={handleOpen}>
        {active?.type === 'video' ? (
          <VideoFacade
            video={active.video}
            title={active.video.title || villa.title}
            className="villa-gallery-main-image"
            aspectRatio="16 / 12"
            autoplay={false}
            muted
            loop
            controls={false}
            playsInline
          />
        ) : active?.image ? (
          <OptimizedImage
            src={active.image.url}
            alt={active.image.alt || villa.title}
            className="villa-gallery-main-image"
            width={1200}
            height={900}
            sizes="(max-width: 1024px) 100vw, 70vw"
            loading="eager"
            cloudinaryOptions={{ widths: [640, 960, 1280, 1920] }}
          />
        ) : null}

        {hasMultiple && (
          <>
            <button
              type="button"
              className="villa-gallery-arrow villa-gallery-prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Imagen anterior"
            >
              ←
            </button>
            <button
              type="button"
              className="villa-gallery-arrow villa-gallery-next"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Imagen siguiente"
            >
              →
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="villa-gallery-thumbs-row">
          {canScrollLeft && (
            <button
              type="button"
              className="thumbs-scroll-arrow thumbs-scroll-arrow-prev"
              onClick={() => scrollThumbs('prev')}
              aria-label="Desplazar miniaturas a la izquierda"
            >
              ‹
            </button>
          )}
          <div
            className="villa-gallery-thumbs"
            ref={thumbsRef}
            onScroll={updateScrollState}
          >
            {media.map((item, idx) => (
              <button
                key={`${item.type === 'video' ? 'v' : item.image.url}-${idx}`}
                type="button"
                className={cn('villa-thumb', idx === activeIndex && 'villa-thumb-active')}
                onClick={() => setIndex(idx)}
                aria-label={`Ver ${item.type === 'video' ? 'video' : 'imagen'} ${idx + 1}`}
                aria-current={idx === activeIndex ? 'true' : undefined}
              >
                {item.type === 'video' ? (
                  <div className="villa-thumb-video">
                    <span aria-hidden="true">▶</span>
                  </div>
                ) : (
                  <OptimizedImage
                    src={item.image.url}
                    alt={item.image.alt || ''}
                    width={150}
                    height={112}
                    loading={Math.abs(idx - activeIndex) <= 1 ? 'eager' : 'lazy'}
                    cloudinaryOptions={{ widths: [150, 300] }}
                  />
                )}
              </button>
            ))}
          </div>
          {canScrollRight && (
            <button
              type="button"
              className="thumbs-scroll-arrow thumbs-scroll-arrow-next"
              onClick={() => scrollThumbs('next')}
              aria-label="Desplazar miniaturas a la derecha"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
