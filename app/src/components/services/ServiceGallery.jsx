import { useState, useMemo } from "react";
import OptimizedImage from "../ui/OptimizedImage.jsx";
import VideoFacade from "../ui/VideoFacade.jsx";
import { getCloudinaryVideoPoster } from "../../lib/utils.js";

export default function ServiceGallery({ service }) {
  const [index, setIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const media = useMemo(() => {
    const items = [];
    if (service.video) {
      items.push({ type: "video", data: service.video });
    }
    (service.images || []).forEach((img) =>
      items.push({ type: "image", data: img }),
    );
    return items;
  }, [service.video, service.images]);

  if (media.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(index, media.length - 1));
  const active = media[safeIndex];
  const hasMultiple = media.length > 1;

  const goPrev = () => {
    setVideoLoaded(false);
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  };
  const goNext = () => {
    setVideoLoaded(false);
    setIndex((prev) => (prev + 1) % media.length);
  };

  const handleVideoClick = () => {
    if (active.type === "video") {
      setVideoLoaded(true);
    }
  };

  return (
    <div className="service-gallery">
      <button
        type="button"
        className="service-gallery-arrow service-gallery-prev"
        onClick={goPrev}
        aria-label="Imagen anterior"
        disabled={!hasMultiple}
      >
        ‹
      </button>

      <div className="service-gallery-image-wrapper">
        {active.type === "video" ? (
          videoLoaded ? (
            <VideoFacade
              video={active.data}
              title={active.data.title || service.name}
              className="service-gallery-image"
              aspectRatio="16 / 9"
              autoplay={true}
              muted={false}
              loop={false}
              controls={true}
              playsInline
            />
          ) : (
            <button
              type="button"
              className="service-gallery-video-placeholder"
              onClick={handleVideoClick}
              aria-label="Reproducir video"
            >
              <OptimizedImage
                src={getCloudinaryVideoPoster(active.data.videoId)}
                alt={active.data.title || service.name}
                className="service-gallery-image"
                width={800}
                height={450}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                cloudinaryOptions={{ widths: [400, 800, 1200] }}
              />
              <div className="service-gallery-play-icon">
                <i className="fa-solid fa-play" aria-hidden="true" />
              </div>
            </button>
          )
        ) : (
          <OptimizedImage
            src={active.data.url}
            alt={active.data.alt || service.name}
            className="service-gallery-image"
            width={800}
            height={450}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            cloudinaryOptions={{ widths: [400, 800, 1200] }}
          />
        )}
      </div>

      <button
        type="button"
        className="service-gallery-arrow service-gallery-next"
        onClick={goNext}
        aria-label="Imagen siguiente"
        disabled={!hasMultiple}
      >
        ›
      </button>
    </div>
  );
}
