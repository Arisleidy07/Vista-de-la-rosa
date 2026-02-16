import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import VillasPage from "./components/VillasPage";
import ServicesPage from "./components/ServicesPage";
import UbicacionPage from "./components/UbicacionPage";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

function Layout({ children }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const logoSrc = `${import.meta.env.BASE_URL}villa.PNG`;

  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <nav className="app-navbar">
          <div className="app-navbar-brand">
            <NavLink to="/" className="brand-link" onClick={handleNavLinkClick}>
              <img
                src={logoSrc}
                alt="Vista de la Rosa logo"
                className="brand-logo"
              />
              <span className="brand-text">Vista de la Rosa</span>
              <i
                className="fa-brands fa-whatsapp brand-whatsapp-icon"
                aria-hidden="true"
              ></i>
            </NavLink>
          </div>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-label="Abrir menú de navegación"
          >
            <span className="nav-toggle-bar" />
          </button>

          <ul
            className={
              "app-nav-links" + (isNavOpen ? " app-nav-links-open" : "")
            }
          >
            <li>
              <NavLink
                to="/"
                end
                className="app-nav-link"
                onClick={handleNavLinkClick}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/villas"
                className="app-nav-link"
                onClick={handleNavLinkClick}
              >
                Villas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/servicios"
                className="app-nav-link"
                onClick={handleNavLinkClick}
              >
                Servicios
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ubicacion"
                className="app-nav-link"
                onClick={handleNavLinkClick}
              >
                Ubicación
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contacto"
                className="app-nav-link"
                onClick={handleNavLinkClick}
              >
                Contacto
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="app-main">{children}</main>

      <Footer />

      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/villas" element={<VillasPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/ubicacion" element={<UbicacionPage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
