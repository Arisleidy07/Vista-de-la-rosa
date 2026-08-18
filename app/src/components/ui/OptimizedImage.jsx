import { forwardRef } from "react";
import {
  getCloudinaryUrl,
  buildCloudinarySrcSet,
  cn,
  withBaseUrl,
} from "../../lib/utils.js";

const DEFAULT_WIDTHS = [320, 640, 960, 1280, 1920];

const OptimizedImage = forwardRef(function OptimizedImage(
  {
    src,
    alt,
    className,
    width,
    height,
    sizes = "100vw",
    loading = "lazy",
    decoding = "async",
    objectFit = "cover",
    cloudinaryOptions = {},
    ...rest
  },
  ref,
) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // Check if src is already a Cloudinary ID (starts with vistadelarosa/) or a local path
  const isCloudinaryId =
    src && (src.startsWith("vistadelarosa/") || src.startsWith("http"));

  let imageSrc;
  let srcSet;

  if (cloudName && isCloudinaryId) {
    // Use Cloudinary for Cloudinary IDs
    imageSrc = getCloudinaryUrl(src, cloudinaryOptions);
    srcSet = buildCloudinarySrcSet(
      src,
      cloudinaryOptions.widths || DEFAULT_WIDTHS,
      cloudinaryOptions,
    );
  } else if (cloudName && src && !src.startsWith("http")) {
    // Try to use Cloudinary for local paths too (convert to Cloudinary ID first)
    const cloudinaryId = src
      .replace(/^\//, "")
      .replace(/\.[^.]+$/, "")
      .replace(/%/g, "")
      .replace(/#/g, "num")
      .replace(/\s+/g, "_")
      .replace(/[^\w\-_/]/g, "")
      .replace(/_+$/, "")
      .toLowerCase();
    const fullCloudinaryId = `vistadelarosa/${cloudinaryId}`;
    imageSrc = getCloudinaryUrl(fullCloudinaryId, cloudinaryOptions);
    srcSet = buildCloudinarySrcSet(
      fullCloudinaryId,
      cloudinaryOptions.widths || DEFAULT_WIDTHS,
      cloudinaryOptions,
    );
  } else {
    // Fallback to local path
    imageSrc = withBaseUrl(src);
    srcSet = undefined;
  }

  return (
    <img
      ref={ref}
      src={imageSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt || ""}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      className={cn("vdl-image", className)}
      style={objectFit ? { objectFit } : undefined}
      {...rest}
    />
  );
});

export default OptimizedImage;
