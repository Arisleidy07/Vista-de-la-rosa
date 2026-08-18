import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  villas,
  blockDetailConfig,
  WHATSAPP_NUMBER,
  WHATSAPP_NUMBER_SECONDARY,
} from "../src/data/villas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  console.error(
    "[seedFirestore] Debes definir la variable de entorno GOOGLE_APPLICATION_CREDENTIALS apuntando a tu service-account.json de Firebase.",
  );
  process.exit(1);
}

initializeApp({
  credential: cert(resolve(serviceAccountPath)),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || "vista-de-la-rosa"}.firebaseio.com`,
});

const db = getFirestore();

function parseCapacity(capacityString) {
  const match = String(capacityString).match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function parseRooms(roomsString) {
  const n = Number(String(roomsString).replace(/\D/g, ""));
  return Number.isNaN(n) ? null : n;
}

const servicesSeed = [
  {
    key: "comedor",
    name: "Comedor",
    description: "Comedor amplio, ideal para compartir en familia.",
    iconClass: "fa-solid fa-utensils",
    images: [
      {
        url: "/comedor/1.JPG",
        alt: "Comedor amplio en Vista de la Rosa",
        order: 0,
      },
    ],
    video: null,
    active: true,
    order: 0,
  },
  {
    key: "cocina",
    name: "Cocina equipada",
    description: "Cocina equipada para grupos y estancias largas.",
    iconClass: "fa-solid fa-kitchen-set",
    images: [
      {
        url: "/comedor/cocina%20equipada/1.JPG",
        alt: "Cocina equipada en Vista de la Rosa",
        order: 0,
      },
    ],
    video: null,
    active: true,
    order: 1,
  },
  {
    key: "piscina",
    name: "Piscina",
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
    name: "Vistas a montañas",
    description: "Entorno natural con vistas espectaculares a las montañas.",
    iconClass: "fa-solid fa-mountain-sun",
    images: [
      {
        url: "/vista%20ala%20monta%C3%B1a%20/1.JPG",
        alt: "Vista a la montaña",
        order: 0,
      },
      {
        url: "/vista%20ala%20monta%C3%B1a%20/2.JPG",
        alt: "Vista a la montaña",
        order: 1,
      },
      {
        url: "/vista%20ala%20monta%C3%B1a%20/3.JPG",
        alt: "Vista a la montaña",
        order: 2,
      },
      {
        url: "/vista%20ala%20monta%C3%B1a%20/5.JPG",
        alt: "Vista a la montaña",
        order: 3,
      },
      {
        url: "/vista%20ala%20monta%C3%B1a%20/6.JPG",
        alt: "Vista a la montaña",
        order: 4,
      },
      {
        url: "/vista%20ala%20monta%C3%B1a%20/7.JPG",
        alt: "Vista a la montaña",
        order: 5,
      },
      {
        url: "/vista%20ala%20monta%C3%B1a%20/8.JPG",
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
    name: "Jacuzzi",
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
    name: "Área de descanso",
    description:
      "Ambientes cálidos y cómodos para descansar y compartir en familia.",
    iconClass: "fa-solid fa-couch",
    images: [
      { url: "/area%20de%20DESCANSO/1.JPG", alt: "Área de descanso", order: 0 },
      { url: "/area%20de%20DESCANSO/3.JPG", alt: "Área de descanso", order: 1 },
      { url: "/area%20de%20DESCANSO/4.JPG", alt: "Área de descanso", order: 2 },
      { url: "/area%20de%20DESCANSO/5.JPG", alt: "Área de descanso", order: 3 },
      {
        url: "/area%20de%20DESCANSO/10.JPG",
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
    name: "Billar",
    description: "Mesa de billar para momentos de diversión.",
    iconClass: "fa-solid fa-chess-board",
    images: [
      { url: "/billar/2.JPG", alt: "Mesa de billar", order: 0 },
      { url: "/billar/3.JPG", alt: "Mesa de billar", order: 1 },
    ],
    video: null,
    active: true,
    order: 6,
  },
];

const heroVideo = {
  provider: "cloudinary",
  videoId: "vistadelarosa/videos/INTRO",
  title: "Vista de la Rosa - Bienvenida",
  duration: null,
};

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

function normalizeImages(list, prefix) {
  return (list || []).map((url, order) => ({
    url: toCloudinaryId(url),
    alt: `${prefix} - imagen ${order + 1}`,
    order,
  }));
}

function buildVariants(blockNumber, title) {
  const cfg = blockDetailConfig[blockNumber] || {};
  const variants = cfg.variants;
  if (!variants) return null;

  const result = {};
  for (const [key, data] of Object.entries(variants)) {
    result[key] = {
      key,
      label: data.label,
      thumb: data.thumb ? toCloudinaryId(data.thumb) : null,
      images: normalizeImages(data.images, `${title} - ${data.label}`),
    };
  }
  return result;
}

async function seedVillas() {
  const batch = db.batch();
  for (const villa of villas) {
    const cfg = blockDetailConfig[villa.block] || {};
    const docRef = db.collection("villas").doc(villa.id);
    const payload = {
      number: villa.number,
      title: villa.title,
      description: villa.description,
      capacity: parseCapacity(cfg.capacity || villa.capacity),
      capacityLabel: cfg.capacity || villa.capacity,
      rooms: parseRooms(cfg.rooms || villa.rooms),
      baths: parseRooms(cfg.baths || villa.baths),
      price: villa.price,
      currency: "USD",
      amenities: cfg.amenities || villa.amenities || [],
      images: normalizeImages(villa.images, villa.title),
      variants: buildVariants(villa.block, villa.title),
      video: villa.video || null,
      location: {
        address: "",
        latitude: null,
        longitude: null,
        googleMapsUrl: "",
      },
      active: true,
      order: villa.number,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    batch.set(docRef, payload);
  }
  await batch.commit();
  console.log(`[seedFirestore] Seeded ${villas.length} villas.`);
}

async function seedServices() {
  const batch = db.batch();
  for (const service of servicesSeed) {
    const docRef = db.collection("services").doc(service.key);
    batch.set(docRef, {
      ...service,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await batch.commit();
  console.log(`[seedFirestore] Seeded ${servicesSeed.length} services.`);
}

async function seedConfig() {
  await db
    .collection("appConfig")
    .doc("public")
    .set({
      contact: {
        whatsapp: WHATSAPP_NUMBER,
        whatsappSecondary: WHATSAPP_NUMBER_SECONDARY,
        phone: "",
        email: "",
      },
      location: {
        address: "Jarabacoa, República Dominicana",
        latitude: null,
        longitude: null,
        googleMapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Jarabacoa%2C%20Rep%C3%BAblica%20Dominicana",
      },
      hero: {
        video: heroVideo,
        title: "Tu escape perfecto en las montañas",
        subtitle: "Villas privadas con amenidades premium en Jarabacoa.",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  console.log("[seedFirestore] Seeded appConfig/public.");
}

async function main() {
  await seedVillas();
  await seedServices();
  await seedConfig();
  console.log("[seedFirestore] Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[seedFirestore] Error:", err);
  process.exit(1);
});
