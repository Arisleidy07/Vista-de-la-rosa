import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "";
const base = repoName ? `/${repoName}/` : "/";

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".mp4") return "video/mp4";
  return "application/octet-stream";
}

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: "serve-habitacion-media",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();

          const decoded = decodeURIComponent(req.url.split("?")[0]);

          // Solo interceptamos las rutas de las habitaciones
          if (!decoded.startsWith("/habitacion")) return next();

          const relPath = decoded.replace(/^\//, "");
          const filePath = path.join(__dirname, "public", relPath);

          try {
            const stat = fs.statSync(filePath);
            if (!stat.isFile()) return next();
          } catch (e) {
            return next();
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", getContentType(filePath));
          fs.createReadStream(filePath).pipe(res);
        });
      },
    },
  ],
  server: {
    port: 5174,
  },
});
