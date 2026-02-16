// Vista de la Rosa Jarabacoa - Frontend UI/UX
// COMENTARIO: Reemplaza WHATSAPP_NUMBER con tu número real en formato internacional sin + ni espacios. Ej: 18295551234
// Para Vista de la Rosa: 1 (809) 323-3496 → 18093233496
const WHATSAPP_NUMBER = "18093233496";

// COMENTARIO: Puedes reemplazar estas URLs por tus imágenes reales. Pueden ser rutas locales o URLs absolutas.
const placeholderImages = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop", // cabaña noche
  "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1600&auto=format&fit=crop", // valle montaña
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop", // casa moderna
  "https://images.unsplash.com/photo-1464082354059-27db6ce50048?q=80&w=1600&auto=format&fit=crop", // cabaña nieve
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop", // bosque
  "https://images.unsplash.com/photo-1521782462922-4b800dcdcc2d?q=80&w=1600&auto=format&fit=crop", // piscina
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop", // sala
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop", // cocina
  "https://images.unsplash.com/photo-1521789421737-1a9112e86fc0?q=80&w=1600&auto=format&fit=crop", // dormitorio
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d48?q=80&w=1600&auto=format&fit=crop", // vista montaña
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop", // terraza
  "https://images.unsplash.com/photo-1521401292936-0a2129a30b22?q=80&w=1600&auto=format&fit=crop", // jacuzzi/bano
];

const serviceGalleryImages = {
  comedor: ["../comedor/1.JPG"],
  cocina: ["../cocina%20equipada/1.JPG"],
  piscina: ["../piscina/2.JPG", "../piscina/3.JPG"],
  montana: [
    "../vista%20ala%20monta%C3%B1a%20/1.JPG",
    "../vista%20ala%20monta%C3%B1a%20/2.JPG",
    "../vista%20ala%20monta%C3%B1a%20/3.JPG",
    "../vista%20ala%20monta%C3%B1a%20/5.JPG",
    "../vista%20ala%20monta%C3%B1a%20/6.JPG",
    "../vista%20ala%20monta%C3%B1a%20/7.JPG",
    "../vista%20ala%20monta%C3%B1a%20/8.JPG",
  ],
  // Quitamos la miniatura 2 rota de jacuzzi y la 6 rota de sala
  jacuzzi: ["../jacuzzi/2.JPG", "../jacuzzi/5.JPG"],
  sala: [
    "../area%20de%20DESCANSO/1.JPG",
    "../area%20de%20DESCANSO/3.JPG",
    "../area%20de%20DESCANSO/4.JPG",
    "../area%20de%20DESCANSO/5.JPG",
  ],
  billar: ["../billar/2.JPG", "../billar/3.JPG"],
};

let currentServiceGalleryKey = null;
let currentServiceGalleryIndex = 0;
let currentServiceGalleryVideoUrl = null;
let currentServiceGalleryHasVideo = false;

// Videos locales para las galerías de servicios (uso en localhost).
const serviceGalleryVideoUrls = {
  piscina: "../piscina/piscina.MP4",
  montana: "../vista%20ala%20monta%C3%B1a%20/4.MP4",
  jacuzzi: "../jacuzzi/jacuzzi.MP4",
  sala: "../area%20de%20DESCANSO/estar.MP4",
};

function swapImageWithFade(imgEl, newSrc, newAlt, duration = 400) {
  if (!imgEl) return;
  const token = String((Number(imgEl.dataset.swapToken || "0") + 1) | 0);
  imgEl.dataset.swapToken = token;
  imgEl.classList.add("img-fade-out");
  window.setTimeout(() => {
    if (imgEl.dataset.swapToken !== token) return;
    imgEl.src = newSrc;
    if (typeof newAlt === "string") imgEl.alt = newAlt;
    imgEl.classList.remove("img-fade-out");
    imgEl.classList.add("img-fade-in");
    window.setTimeout(() => {
      if (imgEl.dataset.swapToken !== token) return;
      imgEl.classList.remove("img-fade-in");
    }, duration);
  }, duration);
}

function setupServiceGalleries() {
  const galleries = document.querySelectorAll(".service-gallery");
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const key = gallery.getAttribute("data-service-key");
    const imgs =
      serviceGalleryImages[key] && serviceGalleryImages[key].length
        ? serviceGalleryImages[key]
        : placeholderImages;
    if (!imgs.length) return;

    const imgEl = gallery.querySelector(".service-gallery-image");
    if (!imgEl) return;
    const prevBtn = gallery.querySelector(".service-gallery-prev");
    const nextBtn = gallery.querySelector(".service-gallery-next");
    const card = gallery.closest(".service-card");
    const title =
      (card && card.getAttribute("data-service-title")) ||
      (card &&
        card.querySelector("h3") &&
        card.querySelector("h3").textContent.trim()) ||
      "";

    let index = 0;

    const updateImage = () => {
      const safeIdx = Math.max(0, Math.min(index, imgs.length - 1));
      index = safeIdx;
      const newSrc = imgs[safeIdx];
      const newAlt = `${title || "Servicio"} - imagen ${safeIdx + 1}`;
      swapImageWithFade(imgEl, newSrc, newAlt);
    };

    const goNext = () => {
      index = (index + 1) % imgs.length;
      updateImage();
    };

    const goPrev = () => {
      index = (index - 1 + imgs.length) % imgs.length;
      updateImage();
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goPrev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goNext();
      });
    }

    const openFromCard = () => {
      openServiceGalleryLightbox(key, title, index);
    };

    imgEl.addEventListener("click", openFromCard);

    const wrapper = gallery.querySelector(".service-gallery-image-wrapper");
    if (wrapper && wrapper !== imgEl.parentElement) {
      wrapper.addEventListener("click", (event) => {
        if (event.target.closest(".service-gallery-arrow")) return;
        openFromCard();
      });
    }

    updateImage();
  });
}

function openServiceGalleryLightbox(key, title, startIndex) {
  const modalEl = document.getElementById("serviceGalleryModal");
  if (!modalEl) return;

  const imgs =
    serviceGalleryImages[key] && serviceGalleryImages[key].length
      ? serviceGalleryImages[key]
      : placeholderImages;
  if (!imgs.length) return;

  currentServiceGalleryKey = key;
  currentServiceGalleryVideoUrl =
    (serviceGalleryVideoUrls && serviceGalleryVideoUrls[key]) || null;
  currentServiceGalleryHasVideo = Boolean(currentServiceGalleryVideoUrl);
  const startImgIndex = Math.max(0, Math.min(startIndex || 0, imgs.length - 1));
  currentServiceGalleryIndex =
    (currentServiceGalleryHasVideo ? 1 : 0) + startImgIndex;

  const titleEl = document.getElementById("serviceGalleryModalLabel");
  if (titleEl) {
    titleEl.textContent = title || "";
  }

  renderServiceGalleryLightbox(imgs, currentServiceGalleryVideoUrl);

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function renderServiceGalleryLightbox(images, videoUrl) {
  const mainHost = document.getElementById("serviceLightboxMain");
  const thumbsContainer = document.getElementById("serviceLightboxThumbs");
  if (!mainHost || !thumbsContainer) return;

  const imgs = images && images.length ? images : placeholderImages;
  const media = [];
  if (videoUrl) media.push({ type: "video", src: videoUrl });
  imgs.forEach((src) => media.push({ type: "img", src }));

  currentServiceGalleryIndex = Math.max(
    0,
    Math.min(currentServiceGalleryIndex, Math.max(0, media.length - 1)),
  );

  const active = media[currentServiceGalleryIndex];
  mainHost.innerHTML = "";
  if (active && active.type === "video") {
    const isRemoteEmbed =
      typeof active.src === "string" &&
      (active.src.startsWith("http") || active.src.startsWith("//"));
    if (isRemoteEmbed) {
      mainHost.innerHTML = `
        <div class="ratio ratio-16x9">
          <iframe
            src="${active.src}"
            title="Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      `;
    } else {
      mainHost.innerHTML = `
        <div class="ratio ratio-16x9 bg-dark">
          <video class="w-100 h-100" controls playsinline preload="metadata">
            <source src="${active.src}" type="video/mp4" />
          </video>
        </div>
      `;
    }
  } else {
    const img = document.createElement("img");
    img.className = "img-fluid rounded shadow-sm";
    const mainAlt = `Imagen ${currentServiceGalleryIndex + 1}`;
    img.alt = mainAlt;
    img.src = (active && active.src) || imgs[0];
    mainHost.appendChild(img);
  }

  thumbsContainer.innerHTML = "";

  media.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "service-lightbox-thumb" +
      (idx === currentServiceGalleryIndex ? " active" : "");

    if (item.type === "img") {
      btn.innerHTML = `<img src="${item.src}" alt="Miniatura ${idx + 1}" />`;
    } else {
      btn.innerHTML = `
        <div class="ratio ratio-1x1 bg-dark d-flex align-items-center justify-content-center">
          <i class="bi bi-play-circle-fill text-white fs-2"></i>
        </div>
      `;
    }

    btn.addEventListener("click", () => {
      currentServiceGalleryIndex = idx;
      renderServiceGalleryLightbox(imgs, videoUrl);
    });
    thumbsContainer.appendChild(btn);
  });
}

function changeServiceGalleryImage(delta) {
  if (!currentServiceGalleryKey) return;

  const imgs =
    serviceGalleryImages[currentServiceGalleryKey] &&
    serviceGalleryImages[currentServiceGalleryKey].length
      ? serviceGalleryImages[currentServiceGalleryKey]
      : placeholderImages;
  if (!imgs.length) return;

  const videoUrl = currentServiceGalleryVideoUrl || null;
  const total = (videoUrl ? 1 : 0) + imgs.length;
  currentServiceGalleryIndex =
    (currentServiceGalleryIndex + delta + total) % total;
  renderServiceGalleryLightbox(imgs, videoUrl);
}

function setupServiceGalleryLightboxControls() {
  const prev = document.querySelector(".service-lightbox-prev");
  const next = document.querySelector(".service-lightbox-next");
  if (prev) {
    prev.addEventListener("click", () => changeServiceGalleryImage(-1));
  }
  if (next) {
    next.addEventListener("click", () => changeServiceGalleryImage(1));
  }
}

// Estado actual de medios para el lightbox
let currentMediaImages = [];
let currentMediaVideoUrl = null;

let currentDetailsVillaId = null;

// Mapeo de amenidades a íconos de Bootstrap Icons
const amenityIcon = {
  Cocina: "bi-egg-fried",
  Wifi: "bi-wifi",
  TV: "bi-tv",
  "A/C": "bi-snow",
  Parqueo: "bi-p-circle",
  Terraza: "bi-sun",
  BBQ: "bi-fire",
  Piscina: "bi-water",
  Jacuzzi: "bi-droplet",
  "Vista Montaña": "bi-geo-alt",
  Cafetera: "bi-cup-hot",
  Sala: "bi-couch",
  Balcón: "bi-window",
  Comedor: "bi-utensils",
  Abanico: "bi-fan",
};

const blockDetailConfig = {
  1: {
    capacity: "12 personas",
    rooms: "2",
    baths: "2",
    amenities: ["Cocina", "A/C", "Sala", "Balcón", "TV"],
    variants: {
      a: {
        label: "Habitación A",
        thumb: "../habitacion%20%231/habitacion%20A/7.JPG",
        images: [
          "../habitacion%20%231/habitacion%20A/7.JPG",
          "../habitacion%20%231/habitacion%20A/8.JPG",
          "../habitacion%20%231/habitacion%20A/9.JPG",
          "../habitacion%20%231/habitacion%20A/10.JPG",
          "../habitacion%20%231/habitacion%20A/11.JPG",
          "../habitacion%20%231/habitacion%20A/12.JPG",
          "../habitacion%20%231/habitacion%20A/14.JPG",
          "../habitacion%20%231/habitacion%20A/15.JPG",
        ],
      },
      b: {
        label: "Habitación B",
        thumb: "../habitacion%20%231/habitacion%20B/17.JPG",
        images: [
          "../habitacion%20%231/habitacion%20B/17.JPG",
          "../habitacion%20%231/habitacion%20B/18.JPG",
          "../habitacion%20%231/habitacion%20B/19.JPG",
          "../habitacion%20%231/habitacion%20B/20.JPG",
          "../habitacion%20%231/habitacion%20B/21.JPG",
          "../habitacion%20%231/habitacion%20B/22.JPG",
          "../habitacion%20%231/habitacion%20B/23.JPG",
          "../habitacion%20%231/habitacion%20B/24.JPG",
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
        thumb: "../habitacion%234/habitacion%20A/10.JPG",
        images: [
          "../habitacion%234/habitacion%20A/10.JPG",
          "../habitacion%234/habitacion%20A/11.JPG",
          "../habitacion%234/habitacion%20A/12.JPG",
          "../habitacion%234/habitacion%20A/13.JPG",
          "../habitacion%234/habitacion%20A/15.JPG",
        ],
      },
      b: {
        label: "Habitación B",
        thumb: "../habitacion%234/habitacion%20B%20/16.JPG",
        images: [
          "../habitacion%234/habitacion%20B%20/16.JPG",
          "../habitacion%234/habitacion%20B%20/17.JPG",
          "../habitacion%234/habitacion%20B%20/18.JPG",
          "../habitacion%234/habitacion%20B%20/19.JPG",
          "../habitacion%234/habitacion%20B%20/20.JPG",
          "../habitacion%234/habitacion%20B%20/21.JPG",
          "../habitacion%234/habitacion%20B%20/22.JPG",
          "../habitacion%234/habitacion%20B%20/23.JPG",
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

function getGalleryForSelection(villa, selectionKey) {
  const cfg = blockDetailConfig[villa.block];
  const variants = cfg && cfg.variants ? cfg.variants : null;
  if (!variants) {
    return {
      images: (villa.images || []).slice(),
      videoUrl: villa.videoUrl || null,
    };
  }

  if (selectionKey && selectionKey !== "all" && variants[selectionKey]) {
    return {
      images: variants[selectionKey].images.slice(),
      videoUrl: villa.videoUrl || null,
    };
  }

  const combined = [];
  (villa.images || []).forEach((src) => combined.push(src));
  Object.keys(variants).forEach((key) => {
    variants[key].images.forEach((src) => combined.push(src));
  });

  return {
    images: combined,
    videoUrl: villa.videoUrl || null,
  };
}

function renderVariantSelector(villa, selectionKey) {
  const host = document.getElementById("modalVariants");
  if (!host) return;

  const cfg = blockDetailConfig[villa.block];
  const variants = cfg && cfg.variants ? cfg.variants : null;

  if (!variants) {
    host.innerHTML = "";
    return;
  }

  const selected = selectionKey || "all";
  const makeCard = (key, label, thumb, meta) => {
    const active = selected === key ? " active" : "";
    const extraClass = key === "all" ? " variant-card--all" : "";
    const thumbHtml = thumb
      ? `<img src="${thumb}" alt="${label}" loading="lazy" />`
      : `<div class="variant-thumb-fallback"></div>`;
    const metaHtml = meta ? `<span class="variant-meta">${meta}</span>` : "";

    return `
      <button type="button" class="variant-card${extraClass}${active}" data-variant="${key}">
        <span class="variant-thumb">${thumbHtml}</span>
        <span class="variant-label">${label}${metaHtml}</span>
      </button>
    `;
  };

  const coverThumb =
    villa.images && villa.images.length
      ? villa.images[0]
      : placeholderImages[0];

  const cards = [
    makeCard("all", "Ver bloque completo", coverThumb, "Todas las fotos"),
    makeCard("a", variants.a.label, variants.a.thumb, "Galería A"),
    makeCard("b", variants.b.label, variants.b.thumb, "Galería B"),
  ].join("");

  host.innerHTML = `<div class="variant-selector">${cards}</div>`;
}

function setupVariantSelectorDelegation() {
  const host = document.getElementById("modalVariants");
  if (!host || host.dataset.delegateReady === "1") return;
  host.dataset.delegateReady = "1";

  host.addEventListener("click", (event) => {
    const btn = event.target.closest(".variant-card");
    if (!btn) return;

    const villa = villas.find((v) => v.id === currentDetailsVillaId);
    if (!villa) return;

    const next = btn.getAttribute("data-variant") || "all";
    const stateKey = `villa_variant_${villa.id}`;
    if (window.sessionStorage) {
      window.sessionStorage.setItem(stateKey, next);
    }

    renderVariantSelector(villa, next);
    const gallery = getGalleryForSelection(villa, next);
    const cfg = blockDetailConfig[villa.block] || {};
    const amenitiesEl = document.getElementById("modalAmenities");
    renderAmenities(amenitiesEl, cfg.amenities || villa.amenities || []);
    renderCarousel(gallery.images, gallery.videoUrl);
    renderThumbnails(gallery.images, gallery.videoUrl);
    currentMediaImages = (gallery.images || []).slice();
    currentMediaVideoUrl = gallery.videoUrl || null;
  });
}

// Data de 20 villas (Array de Objetos)
// Cada villa ahora incluye campos editables: capacity, rooms y baths.
// Puedes cambiar estos valores directamente aquí, villa por villa.
function makeNumberedImages(basePath, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    images.push(`${basePath}/${i}.JPG`);
  }
  return images;
}

function makeNumberedImagesWithSkips(basePath, count, skipNumbers) {
  const skipSet = new Set(skipNumbers || []);
  const images = [];
  for (let i = 1; i <= count; i++) {
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

function applyVillaPrices() {
  villas.forEach((villa) => {
    villa.price = getNightlyPriceForVilla(villa);
  });
}

const villas = [
  {
    id: "h1",
    number: 1,
    title: "Habitación #1 · Bloque 1",
    price: 0,
    block: 1,
    description: "Habitación del Bloque 1.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: [
      "../habitacion%20%231/1.JPG",
      "../habitacion%20%231/2.JPG",
      "../habitacion%20%231/3.JPG",
      "../habitacion%20%231/4.JPG",
      "../habitacion%20%231/5.JPG",
      "../habitacion%20%231/6.JPG",
      "../habitacion%20%231/25.JPG",
    ],
    videoUrl: "../habitacion%20%231/bloque%201.MP4",
  },
  {
    id: "h2",
    number: 2,
    title: "Habitación #2 · Bloque 2",
    price: 0,
    block: 2,
    description: "Habitación del Bloque 2.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("../habitacion%232", 11),
    videoUrl: "../habitacion%232/bloque%202%20.MP4",
  },
  {
    id: "h3",
    number: 3,
    title: "Habitación #3 · Bloque 3",
    price: 0,
    block: 3,
    description: "Habitación del Bloque 3.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("../habitacion%233", 11),
    videoUrl: "../habitacion%233/bloque%203%20.MP4",
  },
  {
    id: "h4",
    number: 4,
    title: "Habitación #4 · Bloque 4",
    price: 0,
    block: 4,
    description: "Habitación del Bloque 4.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: [
      "../habitacion%234/1.JPG",
      "../habitacion%234/2.JPG",
      "../habitacion%234/3.JPG",
      "../habitacion%234/4.JPG",
      "../habitacion%234/5.JPG",
      "../habitacion%234/6.JPG",
      "../habitacion%234/7.JPG",
      "../habitacion%234/8.JPG",
      "../habitacion%234/9.JPG",
    ],
    videoUrl: "../habitacion%234/bloque%204%20.MP4",
  },
  {
    id: "h5",
    number: 5,
    title: "Habitación #5 · Bloque 5",
    price: 0,
    block: 5,
    description: "Habitación del Bloque 5.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("../habitacion%235", 9),
    videoUrl: "../habitacion%235/bloque%205%20.MP4",
  },
  {
    id: "h6",
    number: 6,
    title: "Habitación #6 · Bloque 6",
    price: 0,
    block: 6,
    description: "Habitación del Bloque 6.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("../habitacion%236", 9),
    videoUrl: "../habitacion%236/bloque%206%20.MP4",
  },
  {
    id: "h7",
    number: 7,
    title: "Habitación #7 · Bloque 7",
    price: 0,
    block: 7,
    description: "Habitación del Bloque 7.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("../habitacion%237", 9),
    videoUrl: "../habitacion%237/bloque%207%20.MP4",
  },
  {
    id: "h8",
    number: 8,
    title: "Habitación #8 · Bloque 8",
    price: 0,
    block: 8,
    description: "Habitación del Bloque 8.",
    capacity: "Consultar",
    rooms: "1",
    baths: "Consultar",
    amenities: ["Cocina", "Wifi", "TV", "A/C", "Parqueo"],
    images: makeNumberedImages("../habitacion%238", 14),
    videoUrl: "../habitacion%238/bloque%208%20.MP4",
  },
];

// Renderizado de tarjetas
function renderVillas() {
  const grid = document.getElementById("villas-grid");
  if (!grid) return;
  grid.innerHTML = "";

  villas.forEach((villa) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.setAttribute("data-block", villa.block);

    const mainImage =
      villa.images && villa.images[0] ? villa.images[0] : placeholderImages[0];
    const price = typeof villa.price === "number" ? villa.price : 0;

    col.innerHTML = `
      <div class="card villa-card h-100 position-relative">
        <span class="villa-badge">Villa #${villa.number} - Bloque ${villa.block}</span>
        <span class="price-badge">$${price} /noche</span>
        <img src="${mainImage}" class="card-img-top" alt="Villa ${villa.number} - imagen principal" />
        <div class="card-body d-flex flex-column">
          <h3 class="h5 mb-2">${villa.title}</h3>
          <p class="text-muted mb-4 line-clamp-2">${villa.description}</p>
          <button class="btn btn-gold mt-auto details-btn w-100" data-id="${villa.id}" data-bs-toggle="modal" data-bs-target="#detailsModal">
            Ver Detalles
          </button>
        </div>
      </div>
    `;

    // También abrir detalles al hacer click en la imagen principal
    const imgEl = col.querySelector(".card-img-top");
    if (imgEl) {
      imgEl.addEventListener("click", () => {
        openDetails(villa.id);
        const modalEl = document.getElementById("detailsModal");
        if (modalEl) {
          // eslint-disable-next-line no-undef
          const m = new bootstrap.Modal(modalEl);
          m.show();
        }
      });
    }

    grid.appendChild(col);
  });

  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      openDetails(id);
    });
  });
}

// Lightbox: modal fullscreen con imagen cuadrada y miniaturas
function openLightbox(startIndex = 0) {
  const imgs = currentMediaImages || [];
  const videoUrl = currentMediaVideoUrl || null;
  const totalItems =
    (videoUrl ? 1 : 0) + (imgs && imgs.length ? imgs.length : 1);
  const idx = Math.max(0, Math.min(startIndex, Math.max(0, totalItems - 1)));
  renderLightboxCarousel(imgs, videoUrl, idx);
  renderLightboxThumbnails(imgs, videoUrl, idx);
  const modalEl = document.getElementById("imageLightbox");
  if (modalEl) {
    // eslint-disable-next-line no-undef
    const m = new bootstrap.Modal(modalEl);
    m.show();
  }
}

function renderLightboxCarousel(images, videoUrl, startIndex) {
  const wrap = document.getElementById("lightboxCarouselWrapper");
  if (!wrap) return;
  wrap.innerHTML = "";

  const safeImages = images && images.length ? images : [placeholderImages[0]];
  const poster = safeImages[0] || "";

  const media = [];
  if (videoUrl) media.push({ type: "video", src: videoUrl });
  safeImages.forEach((src) => media.push({ type: "img", src }));

  const activeIndex = Math.max(
    0,
    Math.min(startIndex || 0, Math.max(0, media.length - 1)),
  );

  const items = media
    .map((item, idx) => {
      if (item.type === "img") {
        return `
        <div class="carousel-item ${idx === activeIndex ? "active" : ""}">
          <img src="${item.src}" class="d-block w-100" alt="Imagen ${
            idx + 1
          }" />
        </div>
      `;
      }

      const isRemoteEmbed =
        typeof item.src === "string" &&
        (item.src.startsWith("http") || item.src.startsWith("//"));

      if (isRemoteEmbed) {
        return `
        <div class="carousel-item ${idx === activeIndex ? "active" : ""}">
          <div class="ratio ratio-16x9">
            <iframe
              src="${item.src}"
              title="Video Tour"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      `;
      }

      return `
        <div class="carousel-item ${idx === activeIndex ? "active" : ""}">
          <div class="ratio ratio-16x9">
            <video class="w-100 h-100" controls playsinline preload="metadata" ${
              poster ? `poster="${poster}"` : ""
            }>
              <source src="${item.src}" type="video/mp4" />
            </video>
          </div>
        </div>
      `;
    })
    .join("");

  const id = "lightboxCarousel";
  wrap.innerHTML = `
    <div class="media-main">
      <div id="${id}" class="carousel slide carousel-fade lightbox-carousel" data-bs-ride="false" data-bs-touch="true">
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  `;

  const el = document.getElementById(id);
  if (el) {
    // eslint-disable-next-line no-undef
    const c = new bootstrap.Carousel(el, {
      interval: false,
      touch: true,
      wrap: false,
    });
    const syncThumbs = () => {
      const items = Array.from(el.querySelectorAll(".carousel-item"));
      const idx = items.findIndex((it) => it.classList.contains("active"));
      document
        .querySelectorAll("#lightboxThumbs .thumb-item")
        .forEach((t, i) => t.classList.toggle("active", i === idx));
    };
    el.addEventListener("slid.bs.carousel", syncThumbs);
    syncThumbs();

    // Al cambiar de slide en el lightbox, detener cualquier video que esté sonando
    const stopVideos = () => {
      const videos = el.querySelectorAll("video");
      videos.forEach((vid) => {
        try {
          vid.pause();
          vid.currentTime = 0;
        } catch (e) {
          // ignorar errores de pausa/reset
        }
      });
    };
    el.addEventListener("slide.bs.carousel", stopVideos);
  }
}

function renderLightboxThumbnails(images, videoUrl, startIndex) {
  const thumbs = document.getElementById("lightboxThumbs");
  if (!thumbs) return;
  thumbs.innerHTML = "";

  const safeImages = images && images.length ? images : [placeholderImages[0]];

  const media = [];
  if (videoUrl) media.push({ type: "video", src: videoUrl });
  safeImages.forEach((src) => media.push({ type: "img", src }));

  const activeIndex = Math.max(
    0,
    Math.min(startIndex || 0, Math.max(0, media.length - 1)),
  );

  media.forEach((item, idx) => {
    const col = document.createElement("div");
    col.className = "thumb-item" + (idx === (startIndex || 0) ? " active" : "");

    if (item.type === "img") {
      col.innerHTML = `<img src="${item.src}" alt="Miniatura ${idx + 1}" />`;
    } else {
      col.innerHTML = `
        <div class="ratio ratio-1x1 bg-dark d-flex align-items-center justify-content-center">
          <i class="bi bi-play-circle-fill text-white fs-2"></i>
        </div>
      `;
    }

    col.addEventListener("click", () => {
      const el = document.getElementById("lightboxCarousel");
      if (!el) return;
      // eslint-disable-next-line no-undef
      const c = bootstrap.Carousel.getOrCreateInstance(el);
      c.to(idx);
      document
        .querySelectorAll("#lightboxThumbs .thumb-item")
        .forEach((t, i) => t.classList.toggle("active", i === idx));
    });

    thumbs.appendChild(col);
  });
}

// Abrir modal con detalles
function openDetails(id) {
  const villa = villas.find((v) => v.id === id);
  if (!villa) return;

  currentDetailsVillaId = villa.id;
  setupVariantSelectorDelegation();

  const titleEl = document.getElementById("modalTitle");
  const labelEl = document.getElementById("detailsModalLabel");
  const descEl = document.getElementById("modalDescription");
  const priceEl = document.getElementById("modalPrice");
  const amenitiesEl = document.getElementById("modalAmenities");
  const capacityEl = document.getElementById("modalCapacity");
  const roomsEl = document.getElementById("modalRooms");
  const bathsEl = document.getElementById("modalBaths");
  const reserveBtn = document.getElementById("reserveBtn");

  const cfg = blockDetailConfig[villa.block] || {};
  const stateKey = `villa_variant_${villa.id}`;
  const stored = window.sessionStorage
    ? window.sessionStorage.getItem(stateKey)
    : null;
  const selectionKey = stored || "all";

  if (titleEl) titleEl.textContent = villa.title;
  if (labelEl) labelEl.textContent = `Villa #${villa.number}`;
  if (descEl) descEl.textContent = villa.description;
  if (priceEl) {
    const nightly = typeof villa.price === "number" ? villa.price : 0;
    priceEl.textContent = `$${nightly}`;
  }

  if (capacityEl)
    capacityEl.textContent = cfg.capacity || villa.capacity || "Consultar";
  if (roomsEl) roomsEl.textContent = cfg.rooms || villa.rooms || "Consultar";
  if (bathsEl) bathsEl.textContent = cfg.baths || villa.baths || "Consultar";

  renderVariantSelector(villa, selectionKey);

  const gallery = getGalleryForSelection(villa, selectionKey);
  renderAmenities(amenitiesEl, cfg.amenities || villa.amenities || []);
  renderCarousel(gallery.images, gallery.videoUrl);
  renderThumbnails(gallery.images, gallery.videoUrl);

  currentMediaImages = (gallery.images || []).slice();
  currentMediaVideoUrl = gallery.videoUrl || null;

  if (reserveBtn) {
    const message = encodeURIComponent(
      `Hola, quiero reservar la Villa ${villa.title} en Vista de la Rosa`,
    );
    const phone = WHATSAPP_NUMBER || "18093233496";
    reserveBtn.href = `https://wa.me/${phone}?text=${message}`;
  }
}

function renderAmenities(container, items) {
  if (!container) return;
  container.innerHTML = "";
  items.forEach((amenity) => {
    const icon = amenityIcon[amenity] || "bi-check2-circle";
    const chip = document.createElement("span");
    chip.className =
      "badge rounded-pill bg-light border text-dark d-inline-flex align-items-center gap-1";
    chip.innerHTML = `<i class="bi ${icon}"></i><span>${amenity}</span>`;
    container.appendChild(chip);
  });
}

function renderCarousel(images, videoUrl) {
  const wrap = document.getElementById("modalCarouselWrapper");
  if (!wrap) return;
  wrap.innerHTML = "";

  const safeImages = images && images.length ? images : [placeholderImages[0]];
  const poster = safeImages[0] || "";

  const media = [];
  if (videoUrl) media.push({ type: "video", src: videoUrl });
  safeImages.forEach((src) => media.push({ type: "img", src }));

  const indicators = media
    .map(
      (_, idx) =>
        `<button type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" class="${
          idx === 0 ? "active" : ""
        }" aria-label="Slide ${idx + 1}"></button>`,
    )
    .join("");

  const items = media
    .map((item, idx) => {
      if (item.type === "img") {
        return `
        <div class="carousel-item ${idx === 0 ? "active" : ""}">
          <div class="ratio ratio-16x9">
            <img src="${item.src}" class="w-100 h-100" style="object-fit: contain" alt="Imagen ${
              idx + 1
            } de la villa" />
          </div>
        </div>
      `;
      }

      const isRemoteEmbed =
        typeof item.src === "string" &&
        (item.src.startsWith("http") || item.src.startsWith("//"));

      if (isRemoteEmbed) {
        return `
        <div class="carousel-item ${idx === 0 ? "active" : ""}">
          <div class="ratio ratio-16x9">
            <iframe
              src="${item.src}"
              title="Video Tour"
          <div class="text-center mt-2">
            <a href="${item.src}" target="_blank" rel="noopener" class="small text-decoration-underline">
              Abrir video en YouTube
            </a>
          </div>
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      `;
      }

      return `
        <div class="carousel-item ${idx === 0 ? "active" : ""}">
          <div class="ratio ratio-16x9">
            <video class="w-100 h-100" controls playsinline preload="metadata" ${
              poster ? `poster="${poster}"` : ""
            }>
              <source src="${item.src}" type="video/mp4" />
            </video>
          </div>
        </div>
      `;
    })
    .join("");

  const id = "modalCarousel";
  wrap.innerHTML = `
    <div class="media-main">
      <div id="${id}" class="carousel slide carousel-fade modal-carousel" data-bs-ride="false" data-bs-touch="true">
        <div class="carousel-indicators">${indicators}</div>
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  `;

  // Inicializa el carrusel explícitamente (opcional)
  const el = document.getElementById(id);
  if (el) {
    // eslint-disable-next-line no-undef
    new bootstrap.Carousel(el, { interval: false, touch: true, wrap: false });

    // Abre lightbox solo al tocar IMÁGENES del carrusel.
    // El video se comporta como un reproductor normal con sus controles.
    const clickable = el.querySelectorAll(".carousel-item img");
    clickable.forEach((node) => {
      node.style.cursor = "zoom-in";
      node.addEventListener("click", () => {
        const items = Array.from(el.querySelectorAll(".carousel-item"));
        const idx = items.findIndex((it) => it.classList.contains("active"));
        openLightbox(Math.max(0, idx));
      });
    });

    // Mantener miniaturas sincronizadas con el slide activo
    const updateThumbActive = () => {
      const items = Array.from(el.querySelectorAll(".carousel-item"));
      const idx = items.findIndex((it) => it.classList.contains("active"));
      const thumbs = document.querySelectorAll("#modalThumbs .thumb-item");
      thumbs.forEach((t, i) => t.classList.toggle("active", i === idx));
    };
    el.addEventListener("slid.bs.carousel", updateThumbActive);
    // Llamada inicial (por si las miniaturas ya existen)
    updateThumbActive();

    // Al cambiar de slide, detener cualquier video que estuviera reproduciéndose
    const stopVideos = () => {
      const videos = el.querySelectorAll("video");
      videos.forEach((vid) => {
        try {
          vid.pause();
          vid.currentTime = 0;
        } catch (e) {
          // ignorar errores de pausa/reset
        }
      });
    };
    el.addEventListener("slide.bs.carousel", stopVideos);
  }
}

// Miniaturas de galería (imágenes + video) debajo del carrusel
function renderThumbnails(images, videoUrl) {
  const thumbs = document.getElementById("modalThumbs");
  if (!thumbs) return;
  thumbs.innerHTML = "";

  const safeImages = images && images.length ? images : [placeholderImages[0]];
  const media = [];
  if (videoUrl) media.push({ type: "video", src: videoUrl });
  safeImages.forEach((src) => media.push({ type: "img", src }));

  media.forEach((item, idx) => {
    const col = document.createElement("div");
    // Solo usamos la clase thumb-item; el layout horizontal lo maneja CSS con flexbox
    col.className = "thumb-item";
    if (idx === 0) col.classList.add("active");

    if (item.type === "img") {
      col.innerHTML = `
        <img src="${item.src}" alt="Miniatura ${
          idx + 1
        }" class="img-fluid" role="button" />
      `;
    } else {
      col.innerHTML = `
        <div class="ratio ratio-16x9 bg-dark position-relative" role="button" style="border-radius:0;">
          <div class="position-absolute top-50 start-50 translate-middle text-white">
            <i class="bi bi-play-btn-fill fs-4"></i>
          </div>
        </div>
      `;
    }

    col.addEventListener("click", () => {
      const el = document.getElementById("modalCarousel");
      if (!el) return;
      // eslint-disable-next-line no-undef
      const c = bootstrap.Carousel.getOrCreateInstance(el);
      c.to(idx);
      // Actualiza estado activo manualmente al hacer click
      document
        .querySelectorAll("#modalThumbs .thumb-item")
        .forEach((t, i) => t.classList.toggle("active", i === idx));
    });

    thumbs.appendChild(col);
  });
}

function renderVideo(videoUrl) {
  const wrap = document.getElementById("modalVideoWrapper");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (videoUrl) {
    wrap.classList.remove("d-none");
    wrap.innerHTML = `
      <iframe
        src="${videoUrl}"
        title="Video Tour"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  } else {
    wrap.classList.add("d-none");
  }
}

// Navbar: cambio de estilo al hacer scroll
function setupNavbarScroll() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  nav.classList.remove("nav-cream", "nav-scrolled");
  nav.classList.add("nav-forest");
}

// Al cerrar el modal, detener video (eliminando el iframe)
function setupModalCleanup() {
  const modal = document.getElementById("detailsModal");
  if (!modal) return;
  modal.addEventListener("hidden.bs.modal", () => {
    const wrap = document.getElementById("modalVideoWrapper");
    if (wrap) wrap.innerHTML = "";
  });
}

// Año en footer
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

// Alterna pantalla completa para una imagen del carrusel (fallback abre en nueva pestaña)
function toggleFullscreen(el) {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen();
    return;
  }
  if (el && el.requestFullscreen) {
    el.requestFullscreen().catch(() => {
      try {
        window.open(el.src, "_blank");
      } catch (e) {}
    });
  } else if (el && el.src) {
    try {
      window.open(el.src, "_blank");
    } catch (e) {}
  }
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  if (document.body) {
    document.body.classList.add("page-fade-in");
  }
  applyVillaPrices();
  renderVillas();
  setupServiceGalleries();
  setupServiceGalleryLightboxControls();
  setupNavbarScroll();
  setupModalCleanup();
  setYear();
});
