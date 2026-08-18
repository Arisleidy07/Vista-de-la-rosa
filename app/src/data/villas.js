export const WHATSAPP_NUMBER = "18293410707";
export const WHATSAPP_NUMBER_SECONDARY = "18296511212";

function villaVideo(blockNumber) {
  return {
    provider: "cloudinary",
    videoId: `vistadelarosa/videos/habitacion_${blockNumber}/bloque_${blockNumber}`,
    title: `Habitación #${blockNumber} - video`,
    duration: null,
  };
}

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

export const blockDetailConfig = {
  1: {
    capacity: "12 personas",
    rooms: "2",
    baths: "2",
    amenities: ["Cocina", "A/C", "Sala", "Balcón", "TV"],
    variants: {
      a: {
        label: "Habitación A",
        thumb: toCloudinaryId("/habitacion %231/habitacion A/7.JPG"),
        images: [
          toCloudinaryId("/habitacion %231/habitacion A/7.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/8.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/9.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/10.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/11.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/12.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/14.JPG"),
          toCloudinaryId("/habitacion %231/habitacion A/15.JPG"),
        ],
      },
      b: {
        label: "Habitación B",
        thumb: toCloudinaryId("/habitacion %231/habitacion B/17.JPG"),
        images: [
          toCloudinaryId("/habitacion %231/habitacion B/17.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/18.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/19.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/20.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/21.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/22.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/23.JPG"),
          toCloudinaryId("/habitacion %231/habitacion B/24.JPG"),
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
        thumb: toCloudinaryId("/habitacion#4/habitacion A/10.JPG"),
        images: [
          toCloudinaryId("/habitacion#4/habitacion A/10.JPG"),
          toCloudinaryId("/habitacion#4/habitacion A/11.JPG"),
          toCloudinaryId("/habitacion#4/habitacion A/12.JPG"),
          toCloudinaryId("/habitacion#4/habitacion A/13.JPG"),
          toCloudinaryId("/habitacion#4/habitacion A/15.JPG"),
        ],
      },
      b: {
        label: "Habitación B",
        thumb: toCloudinaryId("/habitacion#4/habitacion B /16.JPG"),
        images: [
          toCloudinaryId("/habitacion#4/habitacion B /16.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /17.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /18.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /19.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /20.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /21.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /22.JPG"),
          toCloudinaryId("/habitacion#4/habitacion B /23.JPG"),
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
// Helpers para generar arrays de imágenes numeradas, usando Cloudinary IDs
function makeNumberedImages(basePath, count) {
  const images = [];
  for (let i = 1; i <= count; i += 1) {
    images.push(toCloudinaryId(`${basePath}/${i}.JPG`));
  }
  return images;
}

function makeNumberedImagesWithSkips(basePath, count, skipNumbers) {
  const skipSet = new Set(skipNumbers || []);
  const images = [];
  for (let i = 1; i <= count; i += 1) {
    if (skipSet.has(i)) continue;
    images.push(toCloudinaryId(`${basePath}/${i}.JPG`));
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

// Datos de villas basados en script.js, adaptados a Cloudinary IDs
const baseVillas = [
  {
    id: "h1",
    number: 1,
    title: "Habitación #1",
    block: 1,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: [
      toCloudinaryId("/habitacion %231/1.JPG"),
      toCloudinaryId("/habitacion %231/2.JPG"),
      toCloudinaryId("/habitacion %231/3.JPG"),
      toCloudinaryId("/habitacion %231/4.JPG"),
      toCloudinaryId("/habitacion %231/5.JPG"),
      toCloudinaryId("/habitacion %231/6.JPG"),
      toCloudinaryId("/habitacion %231/25.JPG"),
    ],
    video: villaVideo(1),
  },
  {
    id: "h2",
    number: 2,
    title: "Habitación #2",
    block: 2,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion#2", 11),
    video: villaVideo(2),
  },
  {
    id: "h3",
    number: 3,
    title: "Habitación #3",
    block: 3,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion#3", 11),
    video: villaVideo(3),
  },
  {
    id: "h4",
    number: 4,
    title: "Habitación #4",
    block: 4,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: [
      toCloudinaryId("/habitacion#4/1.JPG"),
      toCloudinaryId("/habitacion#4/2.JPG"),
      toCloudinaryId("/habitacion#4/3.JPG"),
      toCloudinaryId("/habitacion#4/4.JPG"),
      toCloudinaryId("/habitacion#4/5.JPG"),
      toCloudinaryId("/habitacion#4/6.JPG"),
      toCloudinaryId("/habitacion#4/7.JPG"),
      toCloudinaryId("/habitacion#4/8.JPG"),
      toCloudinaryId("/habitacion#4/9.JPG"),
    ],
    video: villaVideo(4),
  },
  {
    id: "h5",
    number: 5,
    title: "Habitación #5",
    block: 5,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion#5", 9),
    video: villaVideo(5),
  },
  {
    id: "h6",
    number: 6,
    title: "Habitación #6",
    block: 6,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion#6", 9),
    video: villaVideo(6),
  },
  {
    id: "h7",
    number: 7,
    title: "Habitación #7",
    block: 7,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion#7", 9),
    video: villaVideo(7),
  },
  {
    id: "h8",
    number: 8,
    title: "Habitación #8",
    block: 8,
    description: "Habitación.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("/habitacion#8", 14),
    video: villaVideo(8),
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
