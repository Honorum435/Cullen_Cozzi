import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/Cullen_Cozzi/",
  appType: "mpa",
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        estudio: resolve(__dirname, "estudio.html"),
        servicios: resolve(__dirname, "servicios.html"),
        blog: resolve(__dirname, "blog.html"),
        contacto: resolve(__dirname, "contacto.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
