import React, { useState } from "react";
import Lightbox from "./Lightbox";
import { cloudinaryVideoUrl } from "../data/cloudinary";

const services = [
  {
    key: "comedor",
    title: "Comedor",
    description: "Comedor amplio, ideal para compartir en familia.",
    iconClass: "fa-solid fa-utensils",
  },
  {
    key: "cocina",
    title: "Cocina equipada",
    description: "Cocina equipada para grupos y estancias largas.",
    iconClass: "fa-solid fa-kitchen-set",
  },
  {
    key: "piscina",
    title: "Piscina",
    description: "Piscina principal del complejo para disfrutar en grupo.",
    iconClass: "fa-solid fa-person-swimming",
  },
  {
    key: "montana",
    title: "Vistas a montañas",
    description: "Entorno natural con vistas espectaculares a las montañas.",
    iconClass: "fa-solid fa-mountain-sun",
  },
  {
    key: "jacuzzi",
    title: "Jacuzzi",
    description: "Zonas de jacuzzi para relajarse completamente.",
    iconClass: "fa-solid fa-hot-tub-person",
  },
  {
    key: "sala",
    title: "Área de descanso",
    description:
      "Ambientes cálidos y cómodos para descansar y compartir en familia.",
    iconClass: "fa-solid fa-couch",
  },
  {
    key: "billar",
    title: "Billar",
    description: "Mesa de billar para momentos de diversión.",
    iconClass: "fa-solid fa-chess-board",
  },
];

// Rutas relativas a la carpeta public de Vite (app/public)
// Debes copiar tus carpetas reales (comedor, piscina, jacuzzi, etc.) dentro de app/public
const serviceImages = {
  comedor: ["/comedor/1.JPG"],
  // La carpeta real de cocina equipada está dentro de /comedor/cocina equipada
  cocina: ["/comedor/cocina%20equipada/1.JPG"],
  // En piscina solo tenemos el video (piscina.MP4) en app/public/piscina
  // Si luego agregas 2.JPG y 3.JPG aquí, se mostrarán como miniaturas
  piscina: [],
  montana: [
    "/vista%20ala%20monta%C3%B1a%20/1.JPG",
    "/vista%20ala%20monta%C3%B1a%20/2.JPG",
    "/vista%20ala%20monta%C3%B1a%20/3.JPG",
    "/vista%20ala%20monta%C3%B1a%20/5.JPG",
    "/vista%20ala%20monta%C3%B1a%20/6.JPG",
    "/vista%20ala%20monta%C3%B1a%20/7.JPG",
    "/vista%20ala%20monta%C3%B1a%20/8.JPG",
  ],
  // En jacuzzi solo hay jacuzzi.MP4, no imágenes estáticas
  jacuzzi: [],
  // Área de descanso: usamos solo las miniaturas que sí existen
  sala: [
    "/area%20de%20DESCANSO/1.JPG",
    "/area%20de%20DESCANSO/3.JPG",
    "/area%20de%20DESCANSO/4.JPG",
    "/area%20de%20DESCANSO/5.JPG",
    "/area%20de%20DESCANSO/10.JPG",
  ],
  billar: ["/billar/2.JPG", "/billar/3.JPG"],
};

const useCloudinary = Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

const serviceVideos = {
  piscina: useCloudinary
    ? cloudinaryVideoUrl("vistadelarosa/piscina/piscina")
    : "/piscina/piscina.MP4",
  jacuzzi: useCloudinary
    ? cloudinaryVideoUrl("vistadelarosa/jacuzzi/jacuzzi")
    : "/jacuzzi/jacuzzi.MP4",
  sala: useCloudinary
    ? cloudinaryVideoUrl("vistadelarosa/area_de_DESCANSO/estar")
    : "/area%20de%20DESCANSO/estar.MP4",
  billar: useCloudinary
    ? cloudinaryVideoUrl("vistadelarosa/billar/1")
    : "/billar/1.MP4",
};

function withBaseUrl(src) {
  const assetBase =
    import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("/")) return `${assetBase}${src.slice(1)}`;
  return src;
}

function ServiceGallery({ serviceKey, onOpenLightbox }) {
  const [index, setIndex] = useState(0);
  const images = (serviceImages[serviceKey] || []).map((src) =>
    withBaseUrl(src),
  );
  const video = withBaseUrl(serviceVideos[serviceKey]);

  const media = [
    ...(video ? [{ type: "video", src: video }] : []),
    ...images.map((src) => ({ type: "image", src })),
  ];

  if (!media.length) return null;

  const safeIndex = Math.max(0, Math.min(index, media.length - 1));
  const active = media[safeIndex];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  };
  const goNext = () => {
    setIndex((prev) => (prev + 1) % media.length);
  };

  return (
    <div className="service-gallery">
      <button
        type="button"
        className="service-gallery-arrow service-gallery-prev"
        onClick={goPrev}
        aria-label="Imagen anterior"
      >
        ‹
      </button>
      <div
        className="service-gallery-image-wrapper"
        onClick={() => onOpenLightbox && onOpenLightbox(0)}
      >
        {active.type === "video" ? (
          <video
            src={active.src}
            className="service-gallery-image"
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={active.src}
            alt={serviceKey}
            className="service-gallery-image"
          />
        )}
      </div>
      <button
        type="button"
        className="service-gallery-arrow service-gallery-next"
        onClick={goNext}
        aria-label="Imagen siguiente"
      >
        ›
      </button>
    </div>
  );
}

export default function ServicesPage() {
  const [lightboxServiceKey, setLightboxServiceKey] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (serviceKey, index) => {
    setLightboxServiceKey(serviceKey);
    setLightboxIndex(index || 0);
  };

  const handleCloseLightbox = () => {
    setLightboxServiceKey(null);
    setLightboxIndex(0);
  };

  return (
    <section className="section services-page">
      <div className="section-inner">
        <header className="services-header">
          <h1 className="section-title">Amenidades y servicios</h1>
          <p className="section-text">
            Disfruta de piscina, jacuzzi, áreas sociales, comedor, cocina
            equipada y mucho más, en un entorno natural único en Jarabacoa.
          </p>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.key} className="service-card">
              <div className="service-icon">
                <i className={service.iconClass} aria-hidden="true" />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-text">{service.description}</p>
              <ServiceGallery
                serviceKey={service.key}
                onOpenLightbox={(index) =>
                  handleOpenLightbox(service.key, index)
                }
              />
            </article>
          ))}
        </div>

        {lightboxServiceKey && (
          <Lightbox
            title={
              services.find((s) => s.key === lightboxServiceKey)?.title ||
              "Galería"
            }
            initialIndex={lightboxIndex}
            items={(() => {
              const images = (serviceImages[lightboxServiceKey] || []).map(
                (src) => withBaseUrl(src),
              );
              const video = withBaseUrl(serviceVideos[lightboxServiceKey]);
              const videoThumb = images[0] || null;
              const media = [
                ...(video
                  ? [{ type: "video", src: video, thumb: videoThumb }]
                  : []),
                ...images.map((src) => ({ type: "image", src })),
              ];
              return media;
            })()}
            onClose={handleCloseLightbox}
          />
        )}
      </div>
    </section>
  );
}
