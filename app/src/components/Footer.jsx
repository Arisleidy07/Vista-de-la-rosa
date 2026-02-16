import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  const logoSrc = `${assetBase}villa.PNG`;
  const whatsappIconSrc = `${assetBase}ws.png`;

  const primaryRaw = "18293410707";
  const primaryDisplay = "829 341 0707";
  const secondaryRaw = "18296511212";
  const secondaryDisplay = "829 651 1212";

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src={logoSrc}
            alt="Vista de la Rosa logo"
            className="footer-logo"
          />
          <div>
            <div className="footer-brand-name">Vista de la Rosa</div>
            <div className="footer-brand-text">
              Complejo de villas privadas rodeadas de naturaleza en Jarabacoa,
              República Dominicana.
            </div>
          </div>
        </div>
        <div className="footer-column">
          <div className="footer-column-title">Enlaces</div>
          <nav className="footer-links">
            <NavLink to="/" className="footer-link">
              Inicio
            </NavLink>
            <NavLink to="/villas" className="footer-link">
              Villas
            </NavLink>
            <NavLink to="/servicios" className="footer-link">
              Servicios
            </NavLink>
            <NavLink to="/contacto" className="footer-link">
              Contacto
            </NavLink>
          </nav>
        </div>
        <div className="footer-column">
          <div className="footer-column-title">Contacto</div>
          <div className="footer-text-line">
            Jarabacoa, La Vega, República Dominicana
          </div>
          <div className="footer-text-line">
            <a
              href={`https://wa.me/${primaryRaw}`}
              className="footer-link"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={whatsappIconSrc}
                alt="WhatsApp"
                style={{
                  width: "1.05rem",
                  height: "1.05rem",
                  marginRight: "0.45rem",
                }}
              />
              {primaryDisplay}
            </a>
          </div>
          <div className="footer-text-line">
            <a
              href={`https://wa.me/${secondaryRaw}`}
              className="footer-link"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={whatsappIconSrc}
                alt="WhatsApp"
                style={{
                  width: "1.05rem",
                  height: "1.05rem",
                  marginRight: "0.45rem",
                }}
              />
              {secondaryDisplay}
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© {year} Vista de la Rosa. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}
