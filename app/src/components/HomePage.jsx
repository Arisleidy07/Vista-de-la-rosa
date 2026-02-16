import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { cloudinaryVideoUrl } from "../data/cloudinary";

export default function HomePage() {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
  const introSrc = cloudName
    ? cloudinaryVideoUrl("vistadelarosa/intro")
    : `${assetBase}intro.MP4`;

  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
  }, [introSrc]);

  return (
    <section className="hero">
      <div className="video-frame hero-video-frame">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadStart={() => setIsVideoLoading(true)}
          onLoadedData={() => setIsVideoLoading(false)}
          onError={() => {
            setIsVideoLoading(false);
            setVideoError(true);
          }}
        >
          <source src={introSrc} type="video/mp4" />
        </video>
        {(isVideoLoading || videoError) && (
          <div className="video-overlay" aria-live="polite">
            {isVideoLoading && (
              <div className="video-overlay-inner">
                <span className="video-spinner" aria-hidden="true" />
                <span>Cargando video…</span>
              </div>
            )}
            {videoError && (
              <div className="video-overlay-inner">
                <span>No se pudo cargar el video.</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Tu escape perfecto en las montañas</h1>
        <p className="hero-subtitle">
          Villas privadas con amenidades premium en Jarabacoa.
        </p>
        <div className="hero-actions">
          <NavLink to="/villas" className="btn btn-primary">
            Ver Villas
          </NavLink>
          <NavLink to="/contacto" className="btn btn-outline">
            Contáctanos
          </NavLink>
        </div>
      </div>
    </section>
  );
}
