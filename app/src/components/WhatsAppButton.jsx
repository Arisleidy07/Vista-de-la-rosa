import React from "react";
import { WHATSAPP_NUMBER } from "../data/villas";

export default function WhatsAppButton() {
  const phoneRaw = WHATSAPP_NUMBER || "18093233496";

  const whatsappIconSrc = `${import.meta.env.BASE_URL}ws.png`;

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
