const assetBase =
  import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL || "/";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function withBaseUrl(src) {
  if (!src) return src;
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  if (src.startsWith("/")) {
    return `${assetBase}${src.slice(1)}`;
  }
  return `${assetBase}${src}`;
}

export function getCloudinaryUrl(publicId, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return withBaseUrl(publicId);

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    dpr,
  } = options;

  const transforms = [`q_${quality}`, `f_${format}`, `c_${crop}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (dpr) transforms.push(`dpr_${dpr}`);

  const normalized = publicId.startsWith("/") ? publicId.slice(1) : publicId;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${normalized}`;
}

function sanitizeCloudinaryPath(str) {
  return str
    .replace(/%/g, "")
    .replace(/#/g, "num")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-_/]/g, "")
    .replace(/_+$/, "")
    .toLowerCase();
}

export function localPathToCloudinaryId(localPath) {
  if (!localPath || localPath.startsWith("http")) return localPath;
  const cleanPath = localPath.replace(/^\//, "").replace(/\.[^.]+$/, "");
  const sanitized = sanitizeCloudinaryPath(cleanPath);
  return `vistadelarosa/${sanitized}`;
}

export function buildCloudinarySrcSet(publicId, widths, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return undefined;
  return widths
    .map((w) => {
      const url = getCloudinaryUrl(publicId, { ...options, width: w });
      return `${url} ${w}w`;
    })
    .join(", ");
}

export function getCloudflareStreamUrl(videoId) {
  return `https://iframe.videodelivery.net/${videoId}`;
}

export function getCloudinaryVideoUrl(publicId, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return "";
  const { format = "auto", quality = "auto" } = options;
  const transforms = [`f_${format}`, `q_${quality}`];
  const normalized = publicId.startsWith("/") ? publicId.slice(1) : publicId;
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms.join(",")}/${normalized}`;
}

export function getCloudinaryVideoPoster(publicId) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return "";
  const normalized = publicId.startsWith("/") ? publicId.slice(1) : publicId;
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${normalized}.jpg`;
}

export function getVideoEmbedUrl(video) {
  if (!video) return null;
  if (video.provider === "cloudinary" && video.videoId) {
    return getCloudinaryVideoUrl(video.videoId);
  }
  if (video.provider === "cloudflare" && video.videoId) {
    return getCloudflareStreamUrl(video.videoId);
  }
  if (video.embedUrl) return video.embedUrl;
  return null;
}

export function formatPrice(price, currency = "USD") {
  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    return "Consultar";
  }
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(Number(price));
}

export function formatPhone(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 11) {
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return digits;
}
