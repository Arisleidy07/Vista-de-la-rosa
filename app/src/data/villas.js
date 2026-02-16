import { getYouTubeEmbedUrl } from "../youtube";

export const WHATSAPP_NUMBER = "18293410707";
export const WHATSAPP_NUMBER_SECONDARY = "18296511212";

const useCloudinary = Boolean(import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME);
const cloudName = useCloudinary
  ? import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  : "";

function cloudVideo(publicId, fallback) {
  if (!cloudName) return fallback;
  const normalized = publicId.startsWith("/") ? publicId.slice(1) : publicId;
  return `https://res.cloudinary.com/${cloudName}/video/upload/f_mp4/${normalized}`;
}

const blockYouTubeVideos = {
  1: "https://youtu.be/sjmSHZlYO_Q",
  2: "https://youtu.be/GTGvjMlesWk",
  3: "https://youtu.be/XyHTD1mHU5c",
  4: "https://youtu.be/yqAqie1-HrU",
  5: "https://youtu.be/sExueatsnA8",
  6: "https://youtu.be/N4sNhlUE58A",
  7: "https://youtu.be/bweiRM_EFCE",
  8: "https://youtu.be/pf0ct1JXHpk",
};

function youtubeVillaVideo(blockNumber) {
  const link = blockYouTubeVideos[blockNumber];
  if (!link) return null;
  return getYouTubeEmbedUrl(link, {
    autoplay: false,
    muted: true,
    loop: true,
    controls: false,
    playsInline: true,
  });
}

export const blockDetailConfig = {
  1: {
    capacity: "12 personas",
    rooms: "2",
    baths: "2",
    amenities: ["Cocina", "A/C", "Sala", "Balcón", "TV"],
    variants: {
      a: {
        label: "Habitación A",
        thumb: "/habitacion%20%231/habitacion%20A/7.JPG",
        images: [
          "/habitacion%20%231/habitacion%20A/7.JPG",
          "/habitacion%20%231/habitacion%20A/8.JPG",
          "/habitacion%20%231/habitacion%20A/9.JPG",
          "/habitacion%20%231/habitacion%20A/10.JPG",
          "/habitacion%20%231/habitacion%20A/11.JPG",
          "/habitacion%20%231/habitacion%20A/12.JPG",
          "/habitacion%20%231/habitacion%20A/14.JPG",
          "/habitacion%20%231/habitacion%20A/15.JPG",
        ],
      },
      b: {
        label: "Habitación B",
        thumb: "/habitacion%20%231/habitacion%20B/17.JPG",
        images: [
          "/habitacion%20%231/habitacion%20B/17.JPG",
          "/habitacion%20%231/habitacion%20B/18.JPG",
          "/habitacion%20%231/habitacion%20B/19.JPG",
          "/habitacion%20%231/habitacion%20B/20.JPG",
          "/habitacion%20%231/habitacion%20B/21.JPG",
          "/habitacion%20%231/habitacion%20B/22.JPG",
          "/habitacion%20%231/habitacion%20B/23.JPG",
          "/habitacion%20%231/habitacion%20B/24.JPG",
        ],
      },
    },
  },
  2: {
    capacity: "6 personas",
    rooms: "1",
    baths: "1",
    amenities: ["Cocina", "A/C", "TV"],
  },
  3: {
    capacity: "6 personas",
    rooms: "1",
    baths: "1",
    amenities: ["Cocina", "Balcón", "TV"],
  },
  4: {
    capacity: "12 personas",
    rooms: "2",
    baths: "2",
    amenities: ["Comedor", "Cocina", "Balcón", "A/C", "TV"],
    variants: {
      a: {
        label: "Habitación A",
        thumb: "/habitacion%234/habitacion%20A/10.JPG",
        images: [
          "/habitacion%234/habitacion%20A/10.JPG",
          "/habitacion%234/habitacion%20A/11.JPG",
          "/habitacion%234/habitacion%20A/12.JPG",
          "/habitacion%234/habitacion%20A/13.JPG",
          "/habitacion%234/habitacion%20A/15.JPG",
        ],
      },
      b: {
        label: "Habitación B",
        thumb: "/habitacion%234/habitacion%20B%20/16.JPG",
        images: [
          "/habitacion%234/habitacion%20B%20/16.JPG",
          "/habitacion%234/habitacion%20B%20/17.JPG",
          "/habitacion%234/habitacion%20B%20/18.JPG",
          "/habitacion%234/habitacion%20B%20/19.JPG",
          "/habitacion%234/habitacion%20B%20/20.JPG",
          "/habitacion%234/habitacion%20B%20/21.JPG",
          "/habitacion%234/habitacion%20B%20/22.JPG",
          "/habitacion%234/habitacion%20B%20/23.JPG",
        ],
      },
    },
  },
  5: {
    capacity: "6 personas",
    rooms: "1",
    baths: "1",
    amenities: ["Comedor", "Balcón", "Cocina", "A/C", "TV"],
  },
  6: {
    capacity: "6 personas",
    rooms: "1",
    baths: "1",
    amenities: ["Comedor", "Cocina", "A/C", "Abanico", "TV"],
  },
  7: {
    capacity: "4 personas",
    rooms: "1",
    baths: "1",
    amenities: ["Balcón", "A/C", "TV"],
  },
  8: {
    capacity: "6 personas",
    rooms: "1",
    baths: "1",
    amenities: ["Balcón", "Comedor", "Cocina", "A/C", "TV"],
  },
};
// Helpers para generar arrays de imágenes numeradas, usando rutas relativas a app/public
function makeNumberedImages(basePath, count) {
  const images = [];
  for (let i = 1; i <= count; i += 1) {
    images.push(`${basePath}/${i}.JPG`);
  }
  return images;
}

function makeNumberedImagesWithSkips(basePath, count, skipNumbers) {
  const skipSet = new Set(skipNumbers || []);
  const images = [];
  for (let i = 1; i <= count; i += 1) {
    if (skipSet.has(i)) continue;
    images.push(`${basePath}/${i}.JPG`);
  }
  return images;
}

function getNightlyPriceForVilla(villa) {
  const cfg = blockDetailConfig[villa.block] || {};
  const roomsRaw = cfg.rooms || villa.rooms || "0";
  const rooms = Number.parseInt(String(roomsRaw), 10) || 0;
  if (rooms >= 2) return 160;
  if (rooms === 1) return 80;
  return 0;
}

// Datos de villas basados en script.js, adaptados a rutas de la carpeta public
const baseVillas = [
  {
    id: "h1",
    number: 1,
    title: "Habitación #1 · Bloque 1",
    block: 1,
    description: "Habitación del Bloque 1.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: [
      "/habitacion%20%231/1.JPG",
      "/habitacion%20%231/2.JPG",
      "/habitacion%20%231/3.JPG",
      "/habitacion%20%231/4.JPG",
      "/habitacion%20%231/5.JPG",
      "/habitacion%20%231/6.JPG",
      "/habitacion%20%231/25.JPG",
    ],
    videoUrl: youtubeVillaVideo(1),
  },
  {
    id: "h2",
    number: 2,
    title: "Habitación #2 · Bloque 2",
    block: 2,
    description: "Habitación del Bloque 2.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion%232", 11),
    videoUrl: youtubeVillaVideo(2),
  },
  {
    id: "h3",
    number: 3,
    title: "Habitación #3 · Bloque 3",
    block: 3,
    description: "Habitación del Bloque 3.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion%233", 11),
    videoUrl: youtubeVillaVideo(3),
  },
  {
    id: "h4",
    number: 4,
    title: "Habitación #4 · Bloque 4",
    block: 4,
    description: "Habitación del Bloque 4.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: [
      "/habitacion%234/1.JPG",
      "/habitacion%234/2.JPG",
      "/habitacion%234/3.JPG",
      "/habitacion%234/4.JPG",
      "/habitacion%234/5.JPG",
      "/habitacion%234/6.JPG",
      "/habitacion%234/7.JPG",
      "/habitacion%234/8.JPG",
      "/habitacion%234/9.JPG",
    ],
    videoUrl: youtubeVillaVideo(4),
  },
  {
    id: "h5",
    number: 5,
    title: "Habitación #5 · Bloque 5",
    block: 5,
    description: "Habitación del Bloque 5.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion%235", 9),
    videoUrl: youtubeVillaVideo(5),
  },
  {
    id: "h6",
    number: 6,
    title: "Habitación #6 · Bloque 6",
    block: 6,
    description: "Habitación del Bloque 6.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion%236", 9),
    videoUrl: youtubeVillaVideo(6),
  },
  {
    id: "h7",
    number: 7,
    title: "Habitación #7 · Bloque 7",
    block: 7,
    description: "Habitación del Bloque 7.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion%237", 9),
    videoUrl: youtubeVillaVideo(7),
  },
  {
    id: "h8",
    number: 8,
    title: "Habitación #8 · Bloque 8",
    block: 8,
    description: "Habitación del Bloque 8.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion%238", 14),
    videoUrl: youtubeVillaVideo(8),
  },
];

export const villas = baseVillas.map((v) => {
  const cfg = blockDetailConfig[v.block] || {};
  const price = getNightlyPriceForVilla(v);

  return {
    ...v,
    capacity: cfg.capacity || v.capacity || "Consultar",
    rooms: cfg.rooms || v.rooms || "1",
    baths: cfg.baths || v.baths || "1",
    price,
  };
});
