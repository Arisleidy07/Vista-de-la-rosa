import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error(
    "Missing env. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
  );
  process.exit(1);
}

const repoRoot = path.resolve(process.cwd());
const publicDir = path.join(repoRoot, "app", "public");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function isMp4(filePath) {
  return filePath.toLowerCase().endsWith(".mp4");
}

function toPublicId(filePath) {
  const rel = path.relative(publicDir, filePath);
  const withoutExt = rel.replace(/\.mp4$/i, "");
  const posix = withoutExt.split(path.sep).join("/");
  // keep structure but sanitize characters that are annoying in URLs
  return `vistadelarosa/${posix}`
    .replace(/\s+/g, "_")
    .replace(/#/g, "")
    .replace(/\.+/g, ".")
    .replace(/\/+/g, "/");
}

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function randomUploadId() {
  return crypto.randomBytes(12).toString("hex");
}

async function uploadVideo({ filePath, publicId }) {
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    public_id: publicId,
    timestamp: String(timestamp),
  };

  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");

  const signature = sha1(signatureBase + API_SECRET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  const stat = await fs.promises.stat(filePath);
  const fileSize = stat.size;

  // Si el archivo es grande, subimos por chunks para evitar 413
  const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB
  if (fileSize > CHUNK_SIZE) {
    const uploadId = randomUploadId();
    const handle = await fs.promises.open(filePath, "r");
    try {
      let offset = 0;
      let lastJson = null;

      while (offset < fileSize) {
        const endExclusive = Math.min(offset + CHUNK_SIZE, fileSize);
        const length = endExclusive - offset;
        const buffer = Buffer.allocUnsafe(length);
        await handle.read(buffer, 0, length, offset);

        const blob = new Blob([buffer], { type: "video/mp4" });
        const form = new FormData();
        form.set("file", blob, path.basename(filePath));
        form.set("api_key", API_KEY);
        form.set("timestamp", String(timestamp));
        form.set("public_id", publicId);
        form.set("signature", signature);

        const contentRange = `bytes ${offset}-${endExclusive - 1}/${fileSize}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Range": contentRange,
            "X-Unique-Upload-Id": uploadId,
          },
          body: form,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Upload failed (${res.status}): ${text}`);
        }

        lastJson = await res.json();
        offset = endExclusive;
      }

      return lastJson;
    } finally {
      await handle.close();
    }
  }

  const fileBuffer = await fs.promises.readFile(filePath);
  const fileBlob = new Blob([fileBuffer], { type: "video/mp4" });

  const form = new FormData();
  form.set("file", fileBlob, path.basename(filePath));
  form.set("api_key", API_KEY);
  form.set("timestamp", String(timestamp));
  form.set("public_id", publicId);
  form.set("signature", signature);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function main() {
  const all = walk(publicDir).filter(isMp4);
  if (!all.length) {
    console.log("No MP4 files found.");
    return;
  }

  console.log(`Found ${all.length} mp4 videos. Uploading to Cloudinary...`);

  for (const filePath of all) {
    const publicId = toPublicId(filePath);
    console.log(
      `Uploading: ${path.relative(publicDir, filePath)} => ${publicId}`,
    );
    const result = await uploadVideo({ filePath, publicId });
    console.log(`OK: ${result.secure_url}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
