import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readdir, stat } from 'node:fs/promises';
import { resolve, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error('Define GOOGLE_APPLICATION_CREDENTIALS');
  process.exit(1);
}

initializeApp({ credential: cert(resolve(serviceAccountPath)) });
const db = getFirestore();

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      yield fullPath;
    }
  }
}

function toPublicId(relativeFilePath) {
  // relativeFilePath is decoded filesystem path, e.g. "habitacion #1/1.JPG"
  const noExt = relativeFilePath.replace(/\.[^/.]+$/, '');
  const normalized = noExt
    .replace(/%/g, '')
    .replace(/[^a-zA-Z0-9_/\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized;
}

function toLocalUrl(filePath) {
  const rel = relative(publicDir, filePath);
  // Keep raw path for matching Firestore stored paths (e.g. /habitacion%20%231/1.JPG)
  const encoded = rel
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return '/' + encoded;
}

async function uploadWithRetry(filePath, attempt = 1) {
  const rel = relative(publicDir, filePath);
  const publicId = toPublicId(rel);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'vistadelarosa',
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    });
    return { localUrl: toLocalUrl(filePath), publicId: result.public_id, secureUrl: result.secure_url };
  } catch (err) {
    if (attempt < 3) {
      console.warn(`Retry ${attempt} for ${rel}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return uploadWithRetry(filePath, attempt + 1);
    }
    throw err;
  }
}

async function uploadAll(files, concurrency = 5) {
  const results = [];
  let completed = 0;
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const r = await uploadWithRetry(file);
        completed++;
        if (completed % 10 === 0) {
          console.log(`[uploadImages] ${completed}/${files.length} uploaded`);
        }
        return r;
      }),
    );
    results.push(...batchResults);
  }
  return results;
}

async function getAllFiles() {
  const files = [];
  for await (const file of walk(publicDir)) {
    files.push(file);
  }
  return files;
}

async function updateFirestoreImageUrls(mapping) {
  const urlMap = new Map(mapping.map((m) => [m.localUrl, m.publicId]));

  // Villas
  const villaSnap = await db.collection('villas').get();
  for (const doc of villaSnap.docs) {
    const data = doc.data();
    const batch = db.batch();
    const newImages = (data.images || []).map((img) => ({
      ...img,
      url: urlMap.get(img.url) || img.url,
    }));

    const newVariants = {};
    for (const [key, variant] of Object.entries(data.variants || {})) {
      newVariants[key] = {
        ...variant,
        thumb: variant.thumb ? urlMap.get(variant.thumb) || variant.thumb : null,
        images: (variant.images || []).map((img) => ({
          ...img,
          url: urlMap.get(img.url) || img.url,
        })),
      };
    }

    batch.update(doc.ref, {
      images: newImages,
      variants: newVariants,
      updatedAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();
  }

  // Services
  const servicesSnap = await db.collection('services').get();
  for (const doc of servicesSnap.docs) {
    const data = doc.data();
    const newImages = (data.images || []).map((img) => ({
      ...img,
      url: urlMap.get(img.url) || img.url,
    }));
    await doc.ref.update({
      images: newImages,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  console.log('[uploadImages] Firestore URLs updated');
}

async function main() {
  console.log('[uploadImages] Scanning public folder...');
  const files = await getAllFiles();
  console.log(`[uploadImages] Found ${files.length} images`);

  console.log('[uploadImages] Uploading to Cloudinary...');
  const mapping = await uploadAll(files, 5);
  console.log(`[uploadImages] Uploaded ${mapping.length} images`);

  console.log('[uploadImages] Updating Firestore...');
  await updateFirestoreImageUrls(mapping);

  console.log('[uploadImages] Done');
  process.exit(0);
}

main().catch((err) => {
  console.error('[uploadImages] Error:', err);
  process.exit(1);
});
