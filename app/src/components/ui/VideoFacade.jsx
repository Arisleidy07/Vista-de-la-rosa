import { useState, useCallback } from "react";
import {
  getVideoEmbedUrl,
  getCloudinaryVideoUrl,
  getCloudinaryVideoPoster,
  cn,
} from "../../lib/utils.js";

function getVideoPoster(video) {
  if (!video) return null;
  if (video.poster) return video.poster;
  if (video.provider === "cloudinary" && video.videoId) {
    return getCloudinaryVideoPoster(video.videoId);
  }
  return null;
}

export default function VideoFacade({
  video,
  title,
  className,
  aspectRatio = "16 / 10",
  autoplay = false,
  muted = true,
  loop = true,
  controls = true,
  playsInline = true,
  ...rest
}) {
  const [loadPlayer, setLoadPlayer] = useState(autoplay);

  const handleActivate = useCallback(() => {
    setLoadPlayer(true);
  }, []);

  const src = getVideoEmbedUrl(video);
  const poster = getVideoPoster(video);

  if (!src) return null;

  if (!loadPlayer) {
    return (
      <button
        type="button"
        className={cn("video-facade", className)}
        onClick={handleActivate}
        aria-label={`Reproducir video: ${title || "Video"}`}
        style={{
          aspectRatio,
          backgroundImage: poster ? `url(${poster})` : undefined,
        }}
        {...rest}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            className="video-facade-poster"
            loading="lazy"
          />
        )}
        <span className="video-facade-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    );
  }

  // Cloudinary videos play natively via <video>.
  if (video.provider === "cloudinary" && video.videoId) {
    return (
      <div
        className={cn("video-embed", className)}
        style={{ aspectRatio }}
        {...rest}
      >
        <video
          src={getCloudinaryVideoUrl(video.videoId)}
          title={title || "Video"}
          controls={controls}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          autoPlay={autoplay}
          preload="metadata"
          poster={poster || undefined}
        />
      </div>
    );
  }

  // Cloudflare Stream uses iframes.
  if (video.provider === "cloudflare" && video.videoId) {
    return (
      <div
        className={cn("video-embed", className)}
        style={{ aspectRatio }}
        {...rest}
      >
        <iframe
          src={src}
          title={title || "Video"}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}
