import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src="/villa.PNG"
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
          <a href="tel:+18093233496" className="footer-link">
            809 323 3496
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© {year} Vista de la Rosa. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}
