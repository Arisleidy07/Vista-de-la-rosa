import { useAppConfig } from '../../hooks/useAppConfig.js';
import { withBaseUrl, formatPhone } from '../../lib/utils.js';

export default function ContactPage() {
  const { config } = useAppConfig();
  const contact = config?.contact || {};
  const primaryRaw = contact.whatsapp || '18293410707';
  const secondaryRaw = contact.whatsappSecondary || '18296511212';

  const handleWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer');
  };

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
            {primaryRaw && (
              <p className="contact-phone">
                <a href={`tel:+${primaryRaw}`} className="contact-link">
                  {formatPhone(primaryRaw)}
                </a>
              </p>
            )}
            {secondaryRaw && (
              <p className="contact-phone">
                <a href={`tel:+${secondaryRaw}`} className="contact-link">
                  {formatPhone(secondaryRaw)}
                </a>
              </p>
            )}
            <p className="contact-note">
              Para precios y disponibilidad, escribe por mensaje privado.
            </p>
          </div>

          <div className="contact-actions">
            <button
              type="button"
              className="btn btn-primary contact-main-btn"
              onClick={() => handleWhatsApp(primaryRaw)}
            >
              <img
                src={withBaseUrl('ws.png')}
                alt=""
                width="21"
                height="21"
                loading="lazy"
                decoding="async"
                className="contact-icon"
              />
              {formatPhone(primaryRaw)}
            </button>

            {secondaryRaw && (
              <button
                type="button"
                className="btn btn-primary contact-main-btn"
                onClick={() => handleWhatsApp(secondaryRaw)}
              >
                <img
                  src={withBaseUrl('ws.png')}
                  alt=""
                  width="21"
                  height="21"
                  loading="lazy"
                  decoding="async"
                  className="contact-icon"
                />
                {formatPhone(secondaryRaw)}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
