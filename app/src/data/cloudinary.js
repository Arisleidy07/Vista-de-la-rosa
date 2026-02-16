export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_FOLDER =
  import.meta.env.VITE_CLOUDINARY_FOLDER || "vistadelarosa";

export function cloudinaryVideoUrl(publicId) {
  if (!CLOUDINARY_CLOUD_NAME) return "";
  const normalized = publicId.startsWith("/") ? publicId.slice(1) : publicId;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_mp4/${normalized}`;
}
