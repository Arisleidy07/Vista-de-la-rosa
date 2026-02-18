import React from "react";
import { NavLink } from "react-router-dom";
import { getYouTubeEmbedUrl } from "../youtube";

export default function HomePage() {
  const introEmbed = getYouTubeEmbedUrl("https://youtu.be/lYKA2IJ7RXc", {
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    playsInline: true,
  });

  return (
    <section className="hero">
      <iframe
        className="hero-video yt-embed"
        src={introEmbed}
        title="Vista de la Rosa"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
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
