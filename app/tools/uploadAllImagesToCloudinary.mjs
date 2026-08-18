import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

if (
  !process.env.VITE_CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error(
    "[uploadImages] Missing Cloudinary credentials in environment variables.",
  );
  process.exit(1);
}

const SOURCE_DIR = resolve(__dirname, "../../media-backup");
const MAX_CONCURRENT = 5;

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else if (
      entry.isFile() &&
      /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name)
    ) {
      yield fullPath;
    }
  }
}

function sanitizePublicId(str) {
  return str
    .replace(/#/g, "num")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-_/]/g, "")
    .replace(/_+$/, "")
    .toLowerCase();
}

async function uploadImage(filePath) {
  const relativePath = filePath.replace(SOURCE_DIR, "").replace(/^\//, "");
  const sanitizedPath = sanitizePublicId(relativePath);
  const publicId = `vistadelarosa/${sanitizedPath.replace(/\.[^.]+$/, "")}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    console.log(`✓ ${relativePath} → ${result.public_id}`);
    return {
      success: true,
      path: relativePath,
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error(`✗ ${relativePath}: ${error.message}`);
    return { success: false, path: relativePath, error: error.message };
  }
}

async function asyncPool(poolLimit, iterable, iteratorFn) {
  const resolvers = [];
  const executing = [];
  for (const item of iterable) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    resolvers.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(resolvers);
}

async function main() {
  console.log(`[uploadImages] Scanning ${SOURCE_DIR}...`);
  const imageFiles = [];
  for await (const filePath of walkDir(SOURCE_DIR)) {
    imageFiles.push(filePath);
  }
  console.log(`[uploadImages] Found ${imageFiles.length} images to upload.`);

  const results = await asyncPool(MAX_CONCURRENT, imageFiles, uploadImage);

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(
    `\n[uploadImages] Complete: ${successful.length} uploaded, ${failed.length} failed.`,
  );

  if (failed.length > 0) {
    console.log("\nFailed uploads:");
    failed.forEach((f) => console.log(`  - ${f.path}: ${f.error}`));
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("[uploadImages] Fatal error:", err);
  process.exit(1);
});
