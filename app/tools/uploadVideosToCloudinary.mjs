import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readdir, stat, mkdir } from "node:fs/promises";
import { resolve, relative, extname, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const compressedDir = resolve(tmpdir(), "vistadelarosa-videos");
const MAX_UPLOAD_BYTES = 95 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error("Define GOOGLE_APPLICATION_CREDENTIALS");
  process.exit(1);
}

initializeApp({ credential: cert(resolve(serviceAccountPath)) });
const db = getFirestore();

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".mkv", ".avi"]);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (VIDEO_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      yield fullPath;
    }
  }
}

function toPublicId(filePath) {
  const rel = relative(publicDir, filePath);
  const noExt = rel.replace(/\.[^/.]+$/, "");
  return noExt
    .replace(/%/g, "")
    .replace(/[^a-zA-Z0-9_/\-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function classifyVideo(filePath) {
  const rel = relative(publicDir, filePath).toLowerCase();
  if (rel.includes("intro") && !rel.includes("introo"))
    return { type: "hero", id: "public", title: "Vista de la Rosa - Intro" };
  if (rel.includes("introo")) return null; // duplicate intro

  const blockMatch = rel.match(/habitacion\s*#?(\d+)/);
  if (blockMatch) {
    const n = blockMatch[1];
    return { type: "villa", id: `h${n}`, title: `Habitación #${n} - video` };
  }
  if (rel.includes("piscina"))
    return {
      type: "service",
      id: "piscina",
      title: "Piscina - Vista de la Rosa",
    };
  if (rel.includes("jacuzzi"))
    return {
      type: "service",
      id: "jacuzzi",
      title: "Jacuzzi - Vista de la Rosa",
    };
  if (rel.includes("descanso") || rel.includes("estar"))
    return {
      type: "service",
      id: "sala",
      title: "Área de descanso - Vista de la Rosa",
    };

  return null;
}

function uploadVideoAsync(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: "video",
        ...options,
        chunk_size: 6_000_000,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
  });
}

async function cloudinaryResourceExists(publicId) {
  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: "video",
    });
    return resource
      ? {
          public_id: resource.public_id,
          secure_url: resource.secure_url,
          bytes: resource.bytes,
        }
      : null;
  } catch {
    return null;
  }
}

async function asyncPool(concurrency, items, fn) {
  const results = [];
  const executing = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    if (items.length >= concurrency) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) await Promise.race(executing);
    }
  }
  return Promise.allSettled(results);
}

async function compressVideo(inputPath, outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  return new Promise((resolve, reject) => {
    const proc = spawn(
      ffmpegPath,
      [
        "-i",
        inputPath,
        "-c:v",
        "libx264",
        "-crf",
        "26",
        "-preset",
        "fast",
        "-vf",
        "scale=-2:720",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        "-y",
        outputPath,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let err = "";
    proc.stderr.on("data", (data) => (err += data.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error(`ffmpeg exit ${code}: ${err.slice(0, 500)}`));
    });
  });
}

async function uploadVideoWithRetry(filePath, options, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await uploadVideoAsync(filePath, options);
    } catch (err) {
      lastError = err;
      console.warn(
        `[uploadVideos] Reintento ${i + 1}/${attempts} para ${filePath}: ${err.message}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
  throw lastError;
}

async function uploadVideo(filePath) {
  const rel = relative(publicDir, filePath);
  const info = classifyVideo(filePath);
  if (!info) {
    console.log(`[uploadVideos] Ignorado (sin clasificar): ${rel}`);
    return null;
  }

  const publicId = `vistadelarosa/videos/${toPublicId(filePath)}`;

  const existing = await cloudinaryResourceExists(publicId);
  if (existing) {
    console.log(`[uploadVideos] ${rel} ya existe en Cloudinary, omitiendo`);
    return {
      ...info,
      publicId: existing.public_id,
      url: existing.secure_url,
      filePath,
    };
  }

  const { size: originalSize } = await stat(filePath);
  let uploadPath = filePath;

  if (originalSize > MAX_UPLOAD_BYTES) {
    const compressedPath = join(compressedDir, relative(publicDir, filePath));
    try {
      await stat(compressedPath);
      console.log(`[uploadVideos] ${rel} usando compresión previa`);
      uploadPath = compressedPath;
    } catch {
      console.log(
        `[uploadVideos] ${rel} pesa ${(originalSize / 1024 / 1024).toFixed(1)} MB. Comprimiendo...`,
      );
      await compressVideo(filePath, compressedPath);
      const { size: compressedSize } = await stat(compressedPath);
      console.log(
        `[uploadVideos] ${rel} comprimido a ${(compressedSize / 1024 / 1024).toFixed(1)} MB`,
      );
      uploadPath = compressedPath;
    }
  }

  console.log(`[uploadVideos] Subiendo ${rel} → ${publicId}`);

  const result = await uploadVideoWithRetry(uploadPath, {
    public_id: publicId,
    folder: "", // public_id already incluye prefijo de carpeta
    overwrite: true,
    invalidate: true,
  });

  return {
    ...info,
    publicId: result.public_id,
    url: result.secure_url,
    filePath,
  };
}

async function updateFirestore(uploads) {
  for (const upload of uploads) {
    const video = {
      provider: "cloudinary",
      videoId: upload.publicId,
      title: upload.title,
      duration: null,
    };

    if (upload.type === "hero") {
      await db.collection("appConfig").doc("public").update({
        "hero.video": video,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`[uploadVideos] Hero actualizado: ${upload.publicId}`);
    } else if (upload.type === "villa") {
      await db.collection("villas").doc(upload.id).update({
        video,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`[uploadVideos] Villa ${upload.id} actualizada`);
    } else if (upload.type === "service") {
      await db.collection("services").doc(upload.id).update({
        video,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`[uploadVideos] Service ${upload.id} actualizado`);
    }
  }

  // Remove YouTube video from billar service to avoid mixed sources
  await db.collection("services").doc("billar").update({
    video: null,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log("[uploadVideos] Service billar: video eliminado (solo imágenes)");
}

async function main() {
  const files = [];
  for await (const file of walk(publicDir)) {
    files.push(file);
  }

  console.log(`[uploadVideos] Encontrados ${files.length} videos`);

  const results = await asyncPool(2, files, async (file) => {
    try {
      return await uploadVideo(file);
    } catch (err) {
      console.error(
        `[uploadVideos] Error subiendo ${relative(publicDir, file)}:`,
        err.message,
      );
      return null;
    }
  });

  const uploads = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  console.log(`[uploadVideos] ${uploads.length} videos listos en Cloudinary`);
  await updateFirestore(uploads);
  console.log("[uploadVideos] Firestore actualizado");
  process.exit(0);
}

main().catch((err) => {
  console.error("[uploadVideos] Error fatal:", err);
  process.exit(1);
});
