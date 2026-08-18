import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { withBaseUrl } from '../../lib/utils.js';

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/villas', label: 'Villas' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/ubicacion', label: 'Ubicación' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <header className="app-header">
      <nav className="app-navbar" aria-label="Navegación principal">
        <div className="app-navbar-brand">
          <NavLink to="/" className="brand-link" onClick={handleClose}>
            <img
              src={withBaseUrl('villa.PNG')}
              alt="Vista de la Rosa"
              className="brand-logo"
              width="40"
              height="40"
              loading="eager"
              decoding="async"
            />
            <span className="brand-text">Vista de la Rosa</span>
            <i className="fa-brands fa-whatsapp brand-whatsapp-icon" aria-hidden="true" />
          </NavLink>
        </div>

        <button
          type="button"
          className="nav-toggle"
          onClick={handleToggle}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls="main-nav"
        >
          <span className="nav-toggle-bar" />
        </button>

        <ul
          id="main-nav"
          className={'app-nav-links' + (isOpen ? ' app-nav-links-open' : '')}
        >
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className="app-nav-link"
                onClick={handleClose}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
