import React from "react";
import { NavLink } from "react-router-dom";

export default function HomePage() {
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
        <source src="/intro.MP4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Tu escape perfecto en las montañas</h1>
        <p className="hero-subtitle">
          Villas privadas con amenidades premium en Jarabacoa.
        </p>
        <div className="hero-actions">
          <NavLink to="/villas" className="btn btn-primary">
            Reserva tu villa
          </NavLink>
          <NavLink to="/contacto" className="btn btn-outline">
            Contáctanos
          </NavLink>
        </div>
      </div>
    </section>
  );
}
