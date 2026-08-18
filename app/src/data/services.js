function toCloudinaryId(localPath) {
  if (!localPath) return null;
  if (localPath.startsWith("http")) return localPath;
  const cleanPath = localPath.replace(/^\//, "").replace(/\.[^.]+$/, "");
  const sanitized = cleanPath
    .replace(/%/g, "")
    .replace(/#/g, "num")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-_/]/g, "")
    .replace(/_+$/, "")
    .toLowerCase();
  return `vistadelarosa/${sanitized}`;
}

export const services = [
  {
    key: "comedor",
    title: "Comedor",
    description: "Comedor amplio, ideal para compartir en familia.",
    iconClass: "fa-solid fa-utensils",
    images: [
      {
        url: toCloudinaryId("/comedor/1.JPG"),
        alt: "Comedor amplio",
        order: 0,
      },
    ],
    video: null,
    active: true,
    order: 0,
  },
  {
    key: "cocina",
    title: "Cocina equipada",
    description: "Cocina equipada para grupos y estancias largas.",
    iconClass: "fa-solid fa-kitchen-set",
    images: [
      {
        url: toCloudinaryId("/comedor/cocina equipada/1.JPG"),
        alt: "Cocina equipada",
        order: 0,
      },
    ],
    video: null,
    active: true,
    order: 1,
  },
  {
    key: "piscina",
    title: "Piscina",
    description: "Piscina principal del complejo para disfrutar en grupo.",
    iconClass: "fa-solid fa-person-swimming",
    images: [],
    video: {
      provider: "cloudinary",
      videoId: "vistadelarosa/videos/piscina/piscina",
      title: "Piscina - Vista de la Rosa",
      duration: null,
    },
    active: true,
    order: 2,
  },
  {
    key: "montana",
    title: "Vistas a montañas",
    description: "Entorno natural con vistas espectaculares a las montañas.",
    iconClass: "fa-solid fa-mountain-sun",
    images: [
      {
        url: toCloudinaryId("/vista ala montaña /1.JPG"),
        alt: "Vista a la montaña",
        order: 0,
      },
      {
        url: toCloudinaryId("/vista ala montaña /2.JPG"),
        alt: "Vista a la montaña",
        order: 1,
      },
      {
        url: toCloudinaryId("/vista ala montaña /3.JPG"),
        alt: "Vista a la montaña",
        order: 2,
      },
      {
        url: toCloudinaryId("/vista ala montaña /5.JPG"),
        alt: "Vista a la montaña",
        order: 3,
      },
      {
        url: toCloudinaryId("/vista ala montaña /6.JPG"),
        alt: "Vista a la montaña",
        order: 4,
      },
      {
        url: toCloudinaryId("/vista ala montaña /7.JPG"),
        alt: "Vista a la montaña",
        order: 5,
      },
      {
        url: toCloudinaryId("/vista ala montaña /8.JPG"),
        alt: "Vista a la montaña",
        order: 6,
      },
    ],
    video: null,
    active: true,
    order: 3,
  },
  {
    key: "jacuzzi",
    title: "Jacuzzi",
    description: "Zonas de jacuzzi para relajarse completamente.",
    iconClass: "fa-solid fa-hot-tub-person",
    images: [],
    video: {
      provider: "cloudinary",
      videoId: "vistadelarosa/videos/jacuzzi/jacuzzi",
      title: "Jacuzzi - Vista de la Rosa",
      duration: null,
    },
    active: true,
    order: 4,
  },
  {
    key: "sala",
    title: "Área de descanso",
    description:
      "Ambientes cálidos y cómodos para descansar y compartir en familia.",
    iconClass: "fa-solid fa-couch",
    images: [
      {
        url: toCloudinaryId("/area de DESCANSO/1.JPG"),
        alt: "Área de descanso",
        order: 0,
      },
      {
        url: toCloudinaryId("/area de DESCANSO/3.JPG"),
        alt: "Área de descanso",
        order: 1,
      },
      {
        url: toCloudinaryId("/area de DESCANSO/4.JPG"),
        alt: "Área de descanso",
        order: 2,
      },
      {
        url: toCloudinaryId("/area de DESCANSO/5.JPG"),
        alt: "Área de descanso",
        order: 3,
      },
      {
        url: toCloudinaryId("/area de DESCANSO/10.JPG"),
        alt: "Área de descanso",
        order: 4,
      },
    ],
    video: {
      provider: "cloudinary",
      videoId: "vistadelarosa/videos/area_de_DESCANSO/estar",
      title: "Área de descanso - Vista de la Rosa",
      duration: null,
    },
    active: true,
    order: 5,
  },
  {
    key: "billar",
    title: "Billar",
    description: "Mesa de billar para momentos de diversión.",
    iconClass: "fa-solid fa-chess-board",
    images: [
      { url: toCloudinaryId("/billar/2.JPG"), alt: "Mesa de billar", order: 0 },
      { url: toCloudinaryId("/billar/3.JPG"), alt: "Mesa de billar", order: 1 },
    ],
    video: null,
    active: true,
    order: 6,
  },
];
