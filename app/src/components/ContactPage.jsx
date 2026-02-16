import React from "react";
import { WHATSAPP_NUMBER } from "../data/villas";

export default function ContactPage() {
  const phoneRaw = WHATSAPP_NUMBER || "18093233496";
  const phoneDisplay = "809 323 3496";

  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  const whatsappIconSrc = `${assetBase}ws.png`;

  const handleWhatsAppClick = () =>
    window.open(`https://wa.me/${phoneRaw}`, "_blank");

  return (
    <section className="section contact-page">
      <div className="section-inner">
        <div className="contact-card">
          <h1 className="section-title">Contacto y reservas</h1>
          <p className="section-text">
            Para coordinar tu estadía, precios y disponibilidad en Vista de la
            Rosa, contáctanos directamente por WhatsApp.
          </p>

          <div className="contact-info">
            <p className="contact-label">Teléfono / WhatsApp</p>
            <p className="contact-phone">
              <a href={`tel:+${phoneRaw}`} className="contact-link">
                {phoneDisplay}
              </a>
            </p>
            <p className="contact-note">
              Para precios y disponibilidad, escribe por mensaje privado.
            </p>
          </div>

          <div className="contact-actions">
            <button
              type="button"
              className="btn btn-primary contact-main-btn"
              onClick={handleWhatsAppClick}
            >
              <img
                src={whatsappIconSrc}
                alt="WhatsApp"
                style={{
                  width: "1.3rem",
                  height: "1.3rem",
                  marginRight: "0.5rem",
                }}
              />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
