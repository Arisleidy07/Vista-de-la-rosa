import { NavLink } from "react-router-dom";
import { useAppConfig } from "../../hooks/useAppConfig.js";
import VideoFacade from "../ui/VideoFacade.jsx";

export default function HomePage() {
  const { config } = useAppConfig();
  const hero = config?.hero || {};

  return (
    <section className="hero">
      <VideoFacade
        video={hero.video}
        title={hero.title || "Vista de la Rosa"}
        className="hero-video"
        aspectRatio="16 / 9"
        autoplay
        muted
        loop
        controls={false}
        playsInline
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">
          {hero.title || "Tu escape perfecto en las montañas"}
        </h1>
        <p className="hero-subtitle">
          {hero.subtitle ||
            "Villas privadas con amenidades premium en Jarabacoa."}
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
