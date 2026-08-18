import { NavLink } from 'react-router-dom';
import { useAppConfig } from '../../hooks/useAppConfig.js';
import { withBaseUrl, formatPhone } from '../../lib/utils.js';

export default function Footer() {
  const { config } = useAppConfig();
  const year = new Date().getFullYear();

  const contact = config?.contact || {};
  const primaryRaw = contact.whatsapp || '18293410707';
  const secondaryRaw = contact.whatsappSecondary || '18296511212';
  const location = config?.location || {};
  const address = location.address || 'Jarabacoa, La Vega, República Dominicana';

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src={withBaseUrl('villa.PNG')}
            alt="Vista de la Rosa"
            className="footer-logo"
            width="48"
            height="48"
            loading="lazy"
            decoding="async"
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
          <nav className="footer-links" aria-label="Enlaces del pie">
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
          <div className="footer-text-line">{address}</div>
          {primaryRaw && (
            <div className="footer-text-line">
              <a
                href={`https://wa.me/${primaryRaw}`}
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={withBaseUrl('ws.png')}
                  alt=""
                  className="footer-icon"
                  loading="lazy"
                  decoding="async"
                />
                {formatPhone(primaryRaw)}
              </a>
            </div>
          )}
          {secondaryRaw && (
            <div className="footer-text-line">
              <a
                href={`https://wa.me/${secondaryRaw}`}
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={withBaseUrl('ws.png')}
                  alt=""
                  className="footer-icon"
                  loading="lazy"
                  decoding="async"
                />
                {formatPhone(secondaryRaw)}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <small>© {year} Vista de la Rosa. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}
