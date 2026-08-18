import { useAppConfig } from '../../hooks/useAppConfig.js';
import { withBaseUrl } from '../../lib/utils.js';

export default function WhatsAppButton() {
  const { config } = useAppConfig();
  const phoneRaw = config?.contact?.whatsapp || '18293410707';

  const handleClick = () => {
    window.open(`https://wa.me/${phoneRaw}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      className="whatsapp-float-button"
      onClick={handleClick}
      aria-label="Contactar por WhatsApp"
    >
      <img
        src={withBaseUrl('ws.png')}
        alt="WhatsApp"
        width="32"
        height="32"
        loading="eager"
        decoding="async"
      />
    </button>
  );
}
