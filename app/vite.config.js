import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "";
const isGitHubPagesBuild =
  process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
const isVercelBuild = process.env.VERCEL === "1";
const base =
  isGitHubPagesBuild && repoName ? `/${repoName}/` : isVercelBuild ? "/" : "/";

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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase";
            if (id.includes("react-router") || id.includes("@remix-run"))
              return "router";
            if (id.includes("react") || id.includes("scheduler"))
              return "react";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5174,
  },
});
