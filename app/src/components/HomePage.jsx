import React from "react";
import { NavLink } from "react-router-dom";

export default function HomePage() {
  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  const introSrc = `${assetBase}intro.MP4`;

  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={introSrc} type="video/mp4" />
      </video>
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
