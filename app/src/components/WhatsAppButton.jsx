import React from "react";
import { WHATSAPP_NUMBER } from "../data/villas";

export default function WhatsAppButton() {
  const phoneRaw = WHATSAPP_NUMBER;

  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  const whatsappIconSrc = `${assetBase}ws.png`;

  const handleClick = () => {
    window.open(`https://wa.me/${phoneRaw}`, "_blank");
  };

  return (
    <button
      type="button"
      className="whatsapp-float-button"
      onClick={handleClick}
      aria-label="Contactar por WhatsApp"
    >
      <img
        src={whatsappIconSrc}
        alt="WhatsApp"
        style={{ width: "2rem", height: "2rem" }}
      />
    </button>
  );
}
